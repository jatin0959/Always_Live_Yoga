const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");

async function registerUser(req, res) {
    try {

        const { name, whatsapp, referrer } = req.body;

        const uniqueId = generateUniqueId(name);

        let newUser = new User({
            ...req.body,
            // referrer: referrerId,
            uniqueId
        });


        if (referrer) {
            let referrerUser = await User.findOne({ uniqueId: referrer });
            if (referrerUser) {
                referrerUser.karmaPoints += 10; // Example reward
                await referrerUser.save();
            }
            newUser.karmaPoints += 2; // Example reward
        }
        await newUser.save();

        res.redirect(`profile/${newUser.uniqueId}`);
    } catch (error) {
        res.status(500).json(error.message)

    }
}

async function home(req, res) {
    try {
        const referrer = req.query.referrer || '';
        res.render('home', { referrer });
    } catch (error) {
        res.status(500).json({ message: "something went wrong" })

    }
}

async function profile(req, res) {
    const uniqueId = req.params.id
    try {
        const userDoc = await User.findOne({ uniqueId });
        if (!userDoc) {
            return res.status(404).send('User not found');
        }
        const user = userDoc.toObject();
        res.render('profile', { user });

    } catch (error) {
        res.status(500).send('Error loading profile');
    }
}


async function registerWithRefrence(req, res) {
    try {
        const { referrer } = req.params;
        res.render('home', { referrer });

    } catch (error) {
        res.status(500).send('Error loading profile');
    }
}


// async function leaderboard(req, res) {
//     try {

//         res.render('leaderboard');

//     } catch (error) {
//         res.status(500).send('Error loading profile');
//     }
// }


async function leaderboard(req, res) {


    const uniqueId = req.params.id

    console.log(uniqueId);
    try {

        const topUsers = await User.find()
            .sort({ karmaPoints: -1 })
            .limit(10);


        let loggedInUser = await User.findOne({ uniqueId: uniqueId });
        if (!loggedInUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(loggedInUser);
        // Determine logged-in user's rank
        const userRank = await User.countDocuments({ karmaPoints: { $gt: loggedInUser?.karmaPoints } }) + 1;



        const loggedInUserObj = loggedInUser.toObject();
        loggedInUserObj.rank = userRank;

        const data = { topUsers, loggedInUserObj }

        res.render('leaderboard', { data });


    } catch (error) {
        console.error(error);
        throw error;
    }
}


function generateUniqueId(name) {
    const randomString = Math.random().toString(36).substr(2, 5);
    const firstName = name.split(' ')[0];
    return `${firstName}_${randomString}`;
}




module.exports = { registerUser, home, profile, registerWithRefrence, leaderboard }
