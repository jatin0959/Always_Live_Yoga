const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const userRouter = require('./routes.js/userRoute');
const path = require('path');

const app = express();

// Set up Handlebars as the template engine without default layout
app.engine('hbs', engine({ extname: '.hbs', defaultLayout: false }));
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));




// Connect to MongoDB 
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`MongoDB connection error: ${err.message}`));


app.use(userRouter)


// app.post('/register', (req, res) => {
//     const { name, phone, referrer } = req.body;

//     console.log('demo', referrer)
// });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
