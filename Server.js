const express    = require('express');
const nodemailer = require('nodemailer');
const path       = require('path');

const app  = express();
const PORT = 3000;

// ── Middleware ──
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve index.html and javascript.js from this same folder
app.use(express.static(path.join(__dirname)));

// ── Email Credentials (replace these!) ──
const GMAIL_USER     = 'vaishnavvenu2007@gmail.com'; // your Gmail
const GMAIL_APP_PASS = '7b36aa3db07e';        // the 16-char app password

const NOTIFY_EMAIL   = 'vaishnavvenu2007@gmail.com'; // Email you RECEIVE notifications at

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASS
    }
});

// ── POST /register → send notification email ──
app.post('/register', async (req, res) => {
    const { StudentName, RollNo, gender, email, phone, university, course, Address } = req.body;

    const mailOptions = {
        from:    `"Student Registration System" <${GMAIL_USER}>`,
        to:      NOTIFY_EMAIL,
        replyTo: email,
        subject: `🎓 New Registration: ${StudentName} (${RollNo})`,
        html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 560px; margin: auto;
                        border: 1px solid #7c3aed; border-radius: 16px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #7c3aed, #06b6d4);
                            padding: 24px 28px; color: #fff;">
                    <h2 style="margin: 0; font-size: 1.4rem;">🎓 New Student Registration</h2>
                    <p style="margin: 4px 0 0; opacity: 0.85; font-size: 0.9rem;">Submitted via the registration form</p>
                </div>
                <div style="padding: 28px; background: #0f0a1e; color: #e2e8f0;">
                    <table style="width:100%; border-collapse: collapse;">
                        <tr><td style="padding:8px 0; color:#94a3b8; width:140px;">Full Name</td>
                            <td style="padding:8px 0; font-weight:600;">${StudentName}</td></tr>
                        <tr><td style="padding:8px 0; color:#94a3b8;">Roll Number</td>
                            <td style="padding:8px 0; font-weight:600;">${RollNo}</td></tr>
                        <tr><td style="padding:8px 0; color:#94a3b8;">Gender</td>
                            <td style="padding:8px 0;">${gender || '—'}</td></tr>
                        <tr><td style="padding:8px 0; color:#94a3b8;">Email</td>
                            <td style="padding:8px 0;"><a href="mailto:${email}" style="color:#a78bfa;">${email}</a></td></tr>
                        <tr><td style="padding:8px 0; color:#94a3b8;">Phone</td>
                            <td style="padding:8px 0;">${phone}</td></tr>
                        <tr><td style="padding:8px 0; color:#94a3b8;">University</td>
                            <td style="padding:8px 0;">${university}</td></tr>
                        <tr><td style="padding:8px 0; color:#94a3b8;">Course</td>
                            <td style="padding:8px 0;">${course}</td></tr>
                        <tr><td style="padding:8px 0; color:#94a3b8; vertical-align:top;">Address</td>
                            <td style="padding:8px 0;">${Address}</td></tr>
                    </table>
                </div>
                <div style="padding: 14px 28px; background: #0a0715;
                            color: #475569; font-size: 0.78rem; text-align:center;">
                    Sent automatically by the Student Registration System
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully.' });
    } catch (error) {
        console.error('Mail error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ── Start Server ──
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`📧 Notifications will be sent to: ${NOTIFY_EMAIL}`);
});
