const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const gcsRoutes = require('./routes/gcsRoutes');
const consultancyRoutes = require('./routes/consultancyRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const documentRoutes = require('./routes/documentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/files', gcsRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/consultancy', consultancyRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/applications', applicationRoutes);

module.exports = app;
