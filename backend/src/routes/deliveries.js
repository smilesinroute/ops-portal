const express = require('express');
const router = express.Router();
const pool = require('../../../../shared/db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM deliveries');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching deliveries');
    }
});

// Update delivery status with photo tracking
router.post('/update-status', async (req, res) => {
    try {
        const { orderId, type, photo, timestamp } = req.body;
        
        // Update delivery status in database
        let updateQuery;
        let queryParams;
        
        if (type === 'pickup') {
            updateQuery = `
                UPDATE deliveries 
                SET pickup_photo_url = $1, pickup_timestamp = $2, status = 'in-transit'
                WHERE order_id = $3
            `;
            queryParams = [photo.url, timestamp, orderId];
        } else if (type === 'dropoff') {
            updateQuery = `
                UPDATE deliveries 
                SET dropoff_photo_url = $1, dropoff_timestamp = $2, status = 'delivered'
                WHERE order_id = $3
            `;
            queryParams = [photo.url, timestamp, orderId];
        }
        
        await pool.query(updateQuery, queryParams);
        
        // Insert tracking event
        await pool.query(`
            INSERT INTO delivery_tracking (order_id, event_type, photo_url, timestamp, notes)
            VALUES ($1, $2, $3, $4, $5)
        `, [orderId, type, photo.url, timestamp, `${type} photo uploaded`]);
        
        // TODO: Send notification to customer
        // await sendCustomerNotification(orderId, type, photo);
        
        res.json({ success: true, message: `${type} photo updated successfully` });
    } catch (err) {
        console.error('Error updating delivery status:', err);
        res.status(500).json({ error: 'Failed to update delivery status' });
    }
});

// Get delivery tracking for customer
router.get('/track/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const deliveryResult = await pool.query(`
            SELECT * FROM deliveries WHERE order_id = $1
        `, [orderId]);
        
        const trackingResult = await pool.query(`
            SELECT * FROM delivery_tracking 
            WHERE order_id = $1 
            ORDER BY timestamp ASC
        `, [orderId]);
        
        if (deliveryResult.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const delivery = deliveryResult.rows[0];
        const tracking = trackingResult.rows;
        
        res.json({
            orderId,
            status: delivery.status,
            pickupPhoto: delivery.pickup_photo_url,
            dropoffPhoto: delivery.dropoff_photo_url,
            pickupTimestamp: delivery.pickup_timestamp,
            dropoffTimestamp: delivery.dropoff_timestamp,
            tracking
        });
    } catch (err) {
        console.error('Error fetching tracking:', err);
        res.status(500).json({ error: 'Failed to fetch tracking information' });
    }
});

module.exports = router;
