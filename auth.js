const express = require("express");
const User = require("./user");  // ✅ fixed
const nodemailer = require("nodemailer");
const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    const { name, email } = req.body;

    try {
        // Save user to DB
        const user = new User({ name, email, verified: false });
        await user.save();

        // Create Ethereal test account
        let testAccount = await nodemailer.createTestAccount();

        // Transporter
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        // Send email
        let info = await transporter.sendMail({
            from: '"SaaS Landing" <noreply@saas.com>',
            to: email,
            subject: "Verify your email",
            text: "Click the link to verify your email",
            html: `<p>Hello ${name},</p>
             <p>Thanks for signing up! Click below to verify:</p>
             <a href="http://localhost:5000/api/auth/verify/${user._id}">Verify Email</a>`,
        });

        console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));

        res.json({ msg: "Signup successful, verification email sent!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
});

// Verify Route
router.get("/verify/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(400).send("Invalid link");

        user.verified = true;
        await user.save();

        res.send("<h1>Email Verified Successfully 🎉</h1>");
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
