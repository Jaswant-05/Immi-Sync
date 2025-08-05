const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const consultancyRoutes = require('./routes/consultancyRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const documentRoutes = require('./routes/documentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/consultancy', consultancyRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/checklists', checklistRoutes)
app.use('/api/v1/stripe', stripeRoutes)

module.exports = app;
