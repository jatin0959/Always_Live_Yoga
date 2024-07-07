const express = require('express');
const { engine } = require('express-handlebars');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('mongoose');
const userRouter = require('./routes.js/userRoute');
const path = require('path');
const videoRouter = require('./routes.js/videoRoutes');
const cookieParser = require('cookie-parser');
const puppeteer = require('puppeteer');
const attendanceRouter = require('./routes.js/attendance');

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
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));


app.post('/generate-pdf', async (req, res) => {
    const { name } = req.body;
    try {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();

        console.log('klllllllllllllllll');
        const content = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Yoga Certificate</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                    }
                    .certificate {
                        border: 10px solid #80e0d0;
                        padding: 20px;
                        text-align: center;
                        width: 80%;
                        height: 80%;
                        position: relative;
                    }
                    .certificate h1 {
                        color: #d9539e;
                    }
                    .certificate .logo {
                        position: absolute;
                        left: 20px;
                        bottom: 20px;
                        font-size: 24px;
                    }
                    .certificate .footer {
                        position: absolute;
                        right: 20px;
                        bottom: 20px;
                    }
                    .certificate .footer p {
                        margin: 5px 0;
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <h1>YOGA CERTIFICATE</h1>
                    <p>This is presented to</p>
                    <p>for completing yoga challenge</p>
                    <div class="logo">
                        <p>Always Live Yoga</p>
                    </div>
                    <div class="footer">
                        <p>Divi Goyal</p>
                        <p>Divi Goyal, Founder</p>
                        <p>Aly Yoga Pvt. Ltd.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
        console.log('kkkkkkkkkkkkkkkkkkkkk');

        await page.setContent(content);


        const pdfPath = path.join(__dirname, 'certificate.pdf');

        console.log('aaaaaaaaaaaa');

        await page.pdf({ path: pdfPath, format: 'A4' });

        console.log('mmmmmmmmmmmmmmmmmm');

        await browser.close();
        res.download(pdfPath, 'certificate.pdf');
    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`MongoDB connection error: ${err.message}`));

app.use(userRouter);
app.use(videoRouter);
app.use(attendanceRouter)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// 