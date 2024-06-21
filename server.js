const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const userRouter = require('./routes.js/userRoute');
const path = require('path');

const app = express();

// Register a custom helper 'addOne'
const hbs = engine({
    extname: '.hbs',
    defaultLayout: false,
    // helpers: {
    //     addOne: function (value) {
    //         return value + 1;
    //     }
    // },
    helpers: {
        addOne: function (value) {
            return value + 1;
        },
        eq: function (a, b) {
            return a === b;
        }
    },

    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
});

// Set up Handlebars as the template engine
app.engine('hbs', hbs);
app.set('view engine', 'hbs');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`MongoDB connection error: ${err.message}`));

app.use(userRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
