
const express = require('express');
const { google } = require('googleapis');
const User = require('../models/userModel');
const QRCode = require('qrcode');

const videoRouter = express.Router();

const youtube = google.youtube({
    version: 'v3',
    auth: process.env.YOUTUBE_API_KEY,
});

const videoIds = [
    'aIoxtU487yc', 'z0M1l2PhCBc', 'z0M1l2PhCBc', 'z0M1l2PhCBc', 'z0M1l2PhCBc',
    'z0M1l2PhCBc', 'z0M1l2PhCBc', 'z0M1l2PhCBc', 'z0M1l2PhCBc', 'z0M1l2PhCBc'
];

videoRouter.get('/videos/:id', async (req, res) => {
    const user = await User.findById(req.params.id);

    const totalVideos = 10; // Total number of videos for the milestone  videosAccessed
    const videosAccessedCount = user.videosAccessed.length;
    const progressPercentage = (videosAccessedCount / totalVideos) * 100;

    const referralLink = `http://localhost:3001/register/${user.referralLink}`;
    const qrCodeDataUrl = await QRCode.toDataURL(referralLink);

    if (!user) {
        return res.status(404).json({ msg: 'User not found' });
    }

    const daysSinceRegistration = Math.floor((Date.now() - user.registrationDate) / (1000 * 60 * 60 * 24)) + 1;
    const accessibleVideos = videoIds.slice(0, Math.min(daysSinceRegistration, videoIds.length));

    const videoData = await Promise.all(videoIds.map(async (videoId, index) => {
        const response = await youtube.videos.list({
            part: 'snippet',
            id: videoId
        });
        const videoSnippet = response.data.items[0].snippet;
        return {
            id: videoId,
            title: videoSnippet.title,
            description: videoSnippet.description,
            isLocked: index >= accessibleVideos.length // Videos beyond the accessible range are locked
        };
    }));

    res.render('milestone', { videos: videoData, user, qrCodeDataUrl, progressPercentage });
});

videoRouter.post('/update-accessed-video', async (req, res) => {
    try {
        const { videoId } = req.body;
        const userCookie = req.cookies.user;


        console.log('hereeeeee', videoId);
        console.log('demo', userCookie);
        const user = await User.findById(userCookie._id);

        if (!user.videosAccessed.includes(videoId)) {
            user.videosAccessed.push(videoId);
            await user.save();
        }

        const totalVideos = 10;
        const videosAccessedCount = user.videosAccessed.length;
        const progressPercentage = (videosAccessedCount / totalVideos) * 100;

        res.json({ progressPercentage });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = videoRouter;

