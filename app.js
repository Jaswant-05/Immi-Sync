const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const gcsRoutes = require('./routes/gcsRoutes');

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/apiv1/files', gcsRoutes);

module.exports = app;
