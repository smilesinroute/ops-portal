import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db';
import { requireAuth, requireRole } from '../middleware/auth';
import { nextStatusForAction } from '../statusMachine';
import { OrderStatus, UserRole } from '../types';

const router = Router();

const CreateOrderSchema = z.object({
  service_type: z.enum(['notary', 'courier', 'combined']),
  pickup_city: z.string().min(1),
  pickup_zip: z.string().optional(),
  delivery_city: z.string().optional(),
  delivery_zip: z.string().optional(),
  urgency: z.enum(['standard', 'rush']).default('standard'),
  document_type: z.string().optional(),
  notes: z.string().optional(),
});

const UpdateOrderSchema = z.object({
  pickup_city: z.string().optional(),
  pickup_zip: z.string().optional(),
  delivery_city: z.string().optional(),
  delivery_zip: z.string().optional(),
  notes: z.string().optional(),
  base_fee: z.number().optional(),
  rush_fee: z.number().optional(),
  notary_fee: z.number().optional(),
  mileage_fee: z.number().optional(),
  total_fee: z.number().optional(),
});

const AssignSchema = z.object({
  driver_id: z.string().uuid().nullable(),
});

const StatusActionSchema = z.object({
  action: z.enum(['assign', 'pickup_start', 'pickup_complete', 'notary_start', 'complete', 'cancel', 'deliver']),
  note: z.string().optional(),
});

router.get('/health', (_req, res) => res.json({ ok: true }));

// List orders (admin/dispatcher get all; driver gets assigned only)
router.get(
  '/orders',
  requireAuth,
  async (req, res) => {
    const status = (req.query.status as string | undefined)?.toLowerCase();
    const allowedStatus = ['requested','assigned','in_transit','notarizing','completed','canceled'];
    const statusFilter = status && allowedStatus.includes(status) ? status : undefined;

    const user = req.user!;
    let sql = 'select * from orders';
    const params: any[] = [];
    const where: string[] = [];

    if ((user.role as UserRole) === 'driver') {
      where.push('assigned_driver = $1'); params.push(user.id);
    }
    if (statusFilter) {
      where.push(`status = $${params.length + 1}`); params.push(statusFilter);
    }
    if (where.length) sql += ' where ' + where.join(' and ');
    sql += ' order by created_at desc';

    const { rows } = await query(sql, params);
    res.json(rows);
  }
);

// Create order (admin/dispatcher)
router.post(
  '/orders',
  requireAuth,
  requireRole('admin', 'dispatcher'),
  async (req, res) => {
    const parsed = CreateOrderSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
    const o = parsed.data;

    const { rows } = await query(
      `insert into orders (service_type, pickup_city, pickup_zip, delivery_city, delivery_zip, urgency, document_type, notes)
       values ($1,$2,$3,$4,$5,$6,$7,$8) returning *`,
      [o.service_type, o.pickup_city, o.pickup_zip ?? null, o.delivery_city ?? null, o.delivery_zip ?? null, o.urgency, o.document_type ?? null, o.notes ?? null]
    );
    res.status(201).json(rows[0]);
  }
);

// Get order by id (admin/dispatcher or assigned driver)
router.get(
  '/orders/:id',
  requireAuth,
  async (req, res) => {
    const { id } = req.params;
    const user = req.user!;
    const { rows } = await query('select * from orders where id = $1', [id]);
    const order = rows[0];
    if (!order) return res.status(404).json({ error: 'Not found' });
    if (user.role === 'driver' && order.assigned_driver !== user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(order);
  }
);

// Update order (admin/dispatcher)
router.patch(
  '/orders/:id',
  requireAuth,
  requireRole('admin', 'dispatcher'),
  async (req, res) => {
    const parsed = UpdateOrderSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

    const fields = Object.entries(parsed.data).filter(([, v]) => v !== undefined);
    if (!fields.length) return res.status(400).json({ error: 'No changes' });

    const sets: string[] = [];
    const params: any[] = [];
    fields.forEach(([k, v], i) => {
      sets.push(`${k} = $${i + 1}`);
      params.push(v);
    });
    params.push(req.params.id);
    const sql = `update orders set ${sets.join(', ')} where id = $${params.length} returning *`;
    const { rows } = await query(sql, params);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });

    res.json(rows[0]);
  }
);

// Assign/unassign driver (admin/dispatcher)
router.post(
  '/orders/:id/assign',
  requireAuth,
  requireRole('admin', 'dispatcher'),
  async (req, res) => {
    const parsed = AssignSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });
    const { driver_id } = parsed.data;

    const { rows } = await query('update orders set assigned_driver = $1 where id = $2 returning *', [driver_id, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Not found' });

    await query(
      'insert into order_events (order_id, event_type, actor_user, data) values ($1, $2, $3, $4)',
      [req.params.id, 'assigned', req.user!.id, { driver_id } as any]
    );

    // On first assignment only, optionally transition requested -> assigned
    if (rows[0].status === 'requested' && driver_id) {
      const updated = await query('update orders set status = $1 where id = $2 returning *', ['assigned', req.params.id]);
      res.json(updated.rows[0]);
    } else {
      res.json(rows[0]);
    }
  }
);

// Status transition (admin/dispatcher or assigned driver)
router.post(
  '/orders/:id/status',
  requireAuth,
  async (req, res) => {
    const parsed = StatusActionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid payload' });

    const { rows } = await query<{ status: OrderStatus; assigned_driver: string }>('select status, assigned_driver from orders where id = $1', [req.params.id]);
    const current = rows[0];
    if (!current) return res.status(404).json({ error: 'Not found' });

    // Drivers can only act on their assigned orders
    if (req.user!.role === 'driver' && current.assigned_driver !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Determine next status by action and workflow rules
    const next = nextStatusForAction(current.status, parsed.data.action);
    if (!next) return res.status(409).json({ error: 'Invalid transition' });

    const upd = await query('update orders set status = $1 where id = $2 returning *', [next, req.params.id]);

    await query(
      'insert into order_events (order_id, event_type, actor_user, data) values ($1, $2, $3, $4)',
      [req.params.id, 'status_change', req.user!.id, { from: current.status, to: next, note: parsed.data.note } as any]
    );

    res.json(upd.rows[0]);
  }
);

export default router;