const express = require('express');
const dotenv = require('dotenv');
const pool = require('./config/db');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3700;

app.use(express.json());
app.use(cors());

const authRoutes = require('./routes/authRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the QuickMark API!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});