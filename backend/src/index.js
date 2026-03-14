const express = require('express');
const pool = require('../../../shared/db');       // shared db.js
const config = require('../../../shared/config'); // shared config.js
const { appendRow } = require('./googleSheets');
const { generateToken, verifyToken } = require('../../../shared/auth');
const { logError, logInfo } = require('../../../shared/utils');
const { USER_ROLES, DELIVERY_STATUS } = require('../../../shared/constants');

const deliveriesRouter = require('./routes/deliveries');
const driversRouter = require('./routes/drivers');
const adminRouter = require('./routes/admin');

const app = express();
app.use(express.json());

// Mount routes
app.use('/deliveries', deliveriesRouter);
app.use('/drivers', driversRouter);
app.use('/admin', adminRouter);

const PORT = config.PORT || 3000;
app.listen(PORT, () => logInfo(\Ops portal listening on port \\));
