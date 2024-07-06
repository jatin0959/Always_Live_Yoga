const { default: mongoose } = require("mongoose");
const User = require("../models/userModel");
const cookieParser = require("cookie-parser");
const QRCode = require('qrcode');

async function registerUser(req, res) {
    try {
        const { name, referrer } = req.body;

        console.log(req.body);

        const referralLink = generateUniqueId(name);

        let newUser = new User({
            ...req.body,
            // referrer: referrerId,
            referralLink,
        });

        if (referrer) {
            let referrerUser = await User.findOne({ referralLink: referrer });
            if (referrerUser) {
                referrerUser.karmaPoints += 10; // Example reward
                await referrerUser.save();
            }
            newUser.karmaPoints += 2; // Example reward
        }
        await newUser.save();

        res.cookie(
            "user",
            {
                name: newUser.name,
                _id: newUser._id,
                referralLink: newUser.referralLink,
            },
            { httpOnly: true }
        );

        res.redirect(`profile`);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function logout(req, res) {
    try {
        // Clear the user cookie by setting its expiration date to a time in the past
        res.cookie('user', '', { expires: new Date(0), httpOnly: true });

        // Redirect to login or any other appropriate page
        return res.redirect('login');
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function home(req, res) {
    try {
        const userCookie = req.cookies.user;

        if (userCookie) {
            res.redirect(`profile`);
        } else {
            const referrer = req.query.referrer || "";
            res.render("home", { referrer });
        }
    } catch (error) {
        res.status(500).json({ message: "something went wrong" });
    }
}

async function profile(req, res) {
    const userId = req.cookies?.user?._id;

    if (!userId) {
        return res.redirect(`/`);

    }
    try {
        const userDoc = await User.findById(userId);
        const referralLink = `https://always-live-yoga.onrender.com/register/${userDoc.referralLink}`;
        const qrCodeDataUrl = await QRCode.toDataURL(referralLink);
        if (!userDoc) {
            return res.status(404).send("User not found");
        }
        // const user = userDoc.toObject();

        const userRank =
            (await User.countDocuments({
                karmaPoints: { $gt: userDoc?.karmaPoints },
            })) + 1;

        const user = userDoc.toObject();
        user.rank = userRank;

        res.render('profile', {
            user,
            qrCodeDataUrl,
            referralLink
        });
    } catch (error) {
        res.status(500).send("Error loading profile");
    }
}

async function registerWithRefrence(req, res) {
    try {
        const { referrer } = req.params;
        res.render("home", { referrer });
    } catch (error) {
        res.status(500).send("Error loading profile");
    }
}

async function leaderboard(req, res) {
    const referralLink = req.params.id;

    console.log(referralLink);
    try {
        const topUsers = await User.find().sort({ karmaPoints: -1 }).limit(10);

        let loggedInUser = await User.findOne({ referralLink: referralLink });

        const newreferralLink = `https://always-live-yoga.onrender.com/register/${loggedInUser.referralLink}`;
        const qrCodeDataUrl = await QRCode.toDataURL(newreferralLink);

        if (!loggedInUser) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log(loggedInUser);
        // Determine logged-in user's rank
        const userRank =
            (await User.countDocuments({
                karmaPoints: { $gt: loggedInUser?.karmaPoints },
            })) + 1;

        const loggedInUserObj = loggedInUser.toObject();
        loggedInUserObj.rank = userRank;

        const data = { topUsers, loggedInUserObj };

        res.render("leaderboard", { data, user: loggedInUser, qrCodeDataUrl });
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function generateUniqueId(name) {
    const randomString = Math.random().toString(36).substr(2, 5);
    const firstName = name.split(" ")[0];
    return `${firstName}_${randomString}`;
}

async function login(req, res) {
    try {


        // res.cookie(
        //     "user",
        //     {
        //         name: newUser.name,
        //         _id: newUser._id,
        //         referralLink: newUser.referralLink,
        //     },
        //     { httpOnly: true }
        // );

        res.render('login');
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function userLogin(req, res) {
    const { phone } = req.body
    try {
        const user = await User.findOne({ phone: phone });
        if (user) {
            res.cookie(
                "user",
                {
                    name: user.name,
                    _id: user._id,
                    referralLink: user.referralLink,
                },
                { httpOnly: true }
            );

            return res.redirect(`profile`);
        }

        return res.redirect('login');
    } catch (error) {
        res.status(500).json(error.message);
    }
}

async function Resources(req, res) {
    try {

        res.render("Resources");
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = {
    registerUser,
    home,
    profile,
    registerWithRefrence,
    leaderboard,
    logout,
    login,
    userLogin,
    Resources,
};
