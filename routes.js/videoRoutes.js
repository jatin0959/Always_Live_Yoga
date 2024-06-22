// routes/videoRoute.js
const express = require('express');
const videoRouter = express.Router();

videoRouter.get('/videos', (req, res) => {
    res.render('milestone');  // Render the 'videos' template
});

module.exports = videoRouter;
