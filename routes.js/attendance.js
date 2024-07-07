const express = require('express');
const mongoose = require('mongoose');
const Attendance = require('../models/attendance');

const attendanceRouter = express.Router();

// Endpoint to mark attendance
attendanceRouter.post('/attendance', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'UserId is required' });
        }

        const attendance = new Attendance({ userId });
        await attendance.save();

        res.status(201).json({ message: 'Attendance marked successfully', attendance });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Endpoint to get attendance count
attendanceRouter.get('/attendance/count/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const count = await Attendance.countDocuments({ userId });

        res.status(200).json({ userId, attendanceCount: count });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
module.exports = attendanceRouter