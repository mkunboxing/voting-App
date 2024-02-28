const express = require('express');
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials : true // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());



// Routes
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });