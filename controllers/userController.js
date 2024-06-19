const User = require("../models/userModel");

async function registerUser(req, res) {
    try {

        const { name, whatsapp, referrer } = req.body;
        let newUser = new User({ name, whatsapp, referrer });
        await newUser.save();

        if (referrer) {
            let referrerUser = await User.findOne({ _id: referrer });
            if (referrerUser) {
                referrerUser.karmaPoints += 10; // Example reward
                await referrerUser.save();
            }
        }
        res.redirect(`profile/${newUser._id}`);
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
    try {
        const userDoc = await User.findById(req.params.id);
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




module.exports = { registerUser, home, profile, registerWithRefrence }
