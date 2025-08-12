import { OrderStatus } from './types';

// Define valid transitions
const transitions: Record<OrderStatus, OrderStatus[]> = {
  requested: ['assigned', 'canceled'],
  assigned: ['in_transit', 'canceled'],
  in_transit: ['notarizing', 'completed', 'canceled'],
  notarizing: ['completed', 'canceled'],
  completed: [],
  canceled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}

export function nextStatusForAction(
  current: OrderStatus,
  action:
    | 'assign'
    | 'pickup_start'
    | 'pickup_complete'
    | 'notary_start'
    | 'complete'
    | 'cancel'
    | 'deliver'
): OrderStatus | null {
  switch (action) {
    case 'assign':
      return current === 'requested' ? 'assigned' : null;
    case 'pickup_start':
      return current === 'assigned' ? 'in_transit' : null;
    case 'pickup_complete':
      // Some workflows may not need this distinct step; keeping it simple.
      return current === 'in_transit' ? 'in_transit' : null;
    case 'deliver':
      // If no notarizing step required, allow direct completion
      return current === 'in_transit' ? 'completed' : null;
    case 'notary_start':
      return current === 'in_transit' ? 'notarizing' : null;
    case 'complete':
      return current === 'notarizing' ? 'completed' : null;
    case 'cancel':
      return ['requested', 'assigned', 'in_transit', 'notarizing'].includes(current)
        ? 'canceled'
        : null;
    default:
      return null;
  }
}