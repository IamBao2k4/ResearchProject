const Users = require("../models/Users");
const UsersVerification = require("../models/UsersVerification");

const path = require('path');
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const { default: mongoose } = require("mongoose");

const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
});

// Gửi email xác minh
const sendVerificationEmail = async (user) => {
    const currentUrl = process.env.WEB_URL || "http://localhost:3000/";

    const uniqueString = uuidv4() + user._id;

    try {
        // Tạo token xác minh
        const saltRounds = 10;
        const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);

        const newVerification = new UsersVerification({
            userId: user._id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 21600000,
        });
        await newVerification.save();

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Verify Your Email",
            html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
                currentUrl + "verify/" + user._id + "/" + uniqueString
            }>here</a> to process.</p>`,
        };

        console.log("-----transporter", transporter);

        // Gửi email
        await transporter.sendMail(mailOptions);
        return {
            status: "PENDING",
            message: "Verification email sent",
        };
    } catch (error) {
        console.error("Error in sendVerificationEmail:", error);
        throw new Error("Failed to send verification email.");
    }
};

const sendOTPVerificationEmail = async (user, res) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

        // Xóa OTP cũ trước khi tạo mới
        await PasswordReset.deleteOne({ userId: user._id });

        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: user.email,
            subject: "Reset Password OTP",
            html: `<p>Your OTP for resetting your password is <b>${otp}</b><p>This code <b>expires in 1 hour</b></p>.</p>`,
        };

        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const newOTPVerification = new PasswordReset({
            userId: user._id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error in sendOTPVerificationEmail:", error);
        res.status(500).json({
            success: false,
            errors: ["Failed to send OTP. Please try again later."],
        });
    }
};

class SiteController{

    // check if user is authenticated
    checkAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect("/login");
    }

    // check if user is not authenticated
    checkNotAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return res.redirect("/");
        }
        return next();
    }

    // [GET] /
    login(req, res) {
        let rememberedEmail = "";
        const token = req.cookies.rememberMe;

        if (token) {
            try {
                // Giải mã JWT để lấy email
                const decoded = jwt.verify(token, "secret-key"); // Sử dụng "secret-key" đã dùng để mã hóa
                rememberedEmail = decoded.email; // Lấy email từ payload
            } catch (err) {
                console.error("Invalid token:", err);
            }
        }

        res.render("login", { rememberedEmail });
    }

    // [POST] /login
    loginPost(req, res, next) {
        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    errors: [info.message],
                });
            }

            if (!user.verified) {
                return res.status(400).json({
                    success: false,
                    errors: ["Please verify your email address."],
                });
            }

            req.logIn(user, (err) => {
                if (err) return next(err);

                // Nếu chọn "Remember Me"
                if (req.body.rememberMe) {
                    const token = jwt.sign(
                        { email: user.email },
                        "secret-key",
                        {
                            expiresIn: "7d",
                        }
                    );
                    res.cookie("rememberMe", token, {
                        httpOnly: true,
                        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
                    });
                }
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
                res.cookie('token', token, { httpOnly: true });

                return res.status(200).json({
                    success: true,
                    message: "Login successful.",
                });
            });
        })(req, res, next);
    }

    // [GET] /home
     async home(req, res){
        let user;
        if(req.user){
           user = await Users.findById(req.user.id); 
        }
        res.render('home', 
            {
                user: mongooseToObject(user),
            }
        );
    }

    // [GET] /register
    register(req, res){
        res.render('register');
    }

    // [POST] /register
    async registerPost(req, res){
        try {
            const { email, password } = req.body;

            // Kiểm tra email đã tồn tại
            const existingUser = await Users.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    errors: ["Email already exists."],
                });
            }

            // Mã hóa mật khẩu và lưu người dùng mới
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new Users({
                ...req.body,
                password: hashedPassword,
                watchedVideos: [1],
                finishedSteps: [1],
                verified: true,
            });

            await user.save();

            res.status(200).json({
                success: true,
                message: "Registration successful.",
            });
        } catch (error) {
            console.error("Error in registerUser:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [POST] /logout
    logout(req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/login");
        });
    }

    // [GET] /verify/:userId/:uniqueString
    verifyEmail(req, res) {
        const { userId, uniqueString } = req.params;

        UsersVerification.find({ userId })
            .then((result) => {
                if (result.length > 0) {
                    // user verification record exists so we proceed

                    const { expiresAt } = result[0];
                    const hashedUniqueString = result[0].uniqueString;

                    // checking for expired unique string
                    if (expiresAt < Date.now()) {
                        // record has expired so we delete it
                        UsersVerification.deleteOne({ userId })
                            .then((result) => {
                                Users.deleteOne({ _id: userId })
                                    .then(() => {
                                        const message =
                                            "Link has expired. Please sign up again.";
                                        res.redirect(
                                            `/verified/error=true&message=${message}`
                                        );
                                    })
                                    .catch((error) => {
                                        const message =
                                            "Clearing user width expired unique string failed.";
                                        res.redirect(
                                            `/verified/error=true&message=${message}`
                                        );
                                    });
                            })
                            .catch((error) => {
                                console.log(error);
                                const message =
                                    "An error occurred while clearing expired user verification record.";
                                res.redirect(
                                    `/verified/error=true&message=${message}`
                                );
                            });
                    } else {
                        // valid record exists so we validate the user string
                        // first compare the hashed unique string
                        bcrypt
                            .compare(uniqueString, hashedUniqueString)
                            .then((result) => {
                                if (result) {
                                    // strings match

                                    Users.updateOne(
                                        { _id: userId },
                                        { verified: true }
                                    )
                                        .then(() => {
                                            UsersVerification.deleteOne({
                                                userId,
                                            })
                                                .then(() => {
                                                    res.sendFile(
                                                        path.join(
                                                            __dirname,
                                                            "./../../resources/views/verified.html"
                                                        )
                                                    );
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                    const message =
                                                        "An error occurred while finalizing successful verification.";
                                                    res.redirect(
                                                        `/verified/error=true&message=${message}`
                                                    );
                                                });
                                        })
                                        .catch((error) => {
                                            console.log(error);
                                            const message =
                                                "An error occurred while updating user record to show verified.";
                                            res.redirect(
                                                `/verified/error=true&message=${message}`
                                            );
                                        });
                                } else {
                                    // existing record but incorrect verification details passed.
                                    const message =
                                        "Invalid verification details passed. Check your inbox.";
                                    res.redirect(
                                        `/verified/error=true&message=${message}`
                                    );
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                                const message =
                                    "An error occurred while comparing unique strings.";
                                res.redirect(
                                    `/verified/error=true&message=${message}`
                                );
                            });
                    }
                } else {
                    // user verification record doesn't exist
                    const message =
                        "Account record doesn't exist or has been verified already. Please sign up or log in.";
                    res.redirect(`/verified/error=true&message=${message}`);
                }
            })
            .catch((error) => {
                console.log(error);
                const message =
                    "An error occurred while checking for existing user verification record";
                res.redirect(`/verified/error=true&message=${message}`);
            });
    }

    // [GET] /verified
    verified(req, res) {
        res.sendFile(
            path.join(__dirname, "./../../resources/views/verified.html")
        );
    }

    // [GET] /forgot-password
    forgotPassword(req, res){
        res.render('forgotPassword');
    }

    // [POST] /forgot-password
    async forgotPasswordPost(req, res) {
        const { email } = req.body;

        try {
            const user = await Users.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    success: false,
                    errors: ["Email does not exist."],
                });
            }

            if (user.googleId) {
                return res.status(400).json({
                    success: false,
                    errors: ["Email associated with Google account."],
                });
            }

            if (!user.verified) {
                return res.status(400).json({
                    success: false,
                    errors: ["Email not verified."],
                });
            }

            await sendOTPVerificationEmail(user, res);

            res.status(200).json({
                success: true,
                message: "OTP sent to email.",
                userId: user._id,
            });
        } catch (error) {
            console.error("Error in forgotPasswordPost:", error);
            res.status(500).json({
                success: false,
                errors: ["Server error. Please try again later."],
            });
        }
    }

    // [GET] /survey
    async survey(req, res){
        const user = await Users.findOne({ _id: req.user._id });
        res.render('survey', {
            user: mongooseToObject(user),
        });
    }

    // [GET] /practice/:score
    async practice(req, res){
        const { score } = req.params;
        let user = null;
        
        if (req.user) {
            user = await Users.findById(req.user.id);
            user = mongooseToObject(user);
        }
        
        res.render('practice', { 
            score,
            user: user,
        });
    }

    // [GET] /diary-status
    async diaryStatus(req, res){
        const user = await Users.findById(req.user.id);
        res.render('diary_status', {
            user: mongooseToObject(user),
        });
    }
}

module.exports = new SiteController;