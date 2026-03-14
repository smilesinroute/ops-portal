const express = require('express');
const pool = require('C:\Users\User\smilesinroute-portal-system\shared/db');
const config = require('C:\Users\User\smilesinroute-portal-system\shared/config');
const { appendRow } = require('./googleSheets');
const { generateToken, verifyToken } = require('C:\Users\User\smilesinroute-portal-system\shared/auth');
const { logError, logInfo } = require('C:\Users\User\smilesinroute-portal-system\shared/utils');
const { USER_ROLES, DELIVERY_STATUS } = require('C:\Users\User\smilesinroute-portal-system\shared/constants');

const app = express();
app.use(express.json());

// Example endpoint
app.get('/', (req, res) => res.send('✅ Ops portal running'));

// Example: sync deliveries to Google Sheets
async function syncToSheets() {
    try {
        const resDb = await pool.query('SELECT * FROM deliveries'); // adjust table
        const spreadsheetId = config.SHEETS_ID;
        const range = 'Sheet1!A1';
        for (const row of resDb.rows) {
            await appendRow(spreadsheetId, range, [row.id, row.customer_name, row.address, row.status]);
        }
        logInfo('✅ Data synced to Google Sheets');
    } catch (err) {
        logError(err);
    }
}

// Optional: sync on server start
syncToSheets();

const PORT = config.PORT;
app.listen(PORT, () => logInfo(\Ops portal listening on port \\));
