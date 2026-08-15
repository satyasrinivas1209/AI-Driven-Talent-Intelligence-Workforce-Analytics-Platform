const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const auth = require('../middleware/authMiddleware');

// ─── Gmail OAuth2 Client ──────────────────────────────────────────────────────
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI || 'http://localhost:5000/api/email/oauth2callback'
);

// ─── Step 1: Generate Auth URL ────────────────────────────────────────────────
router.get('/auth', auth, (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    prompt: 'select_account',
  });
  res.redirect(url);
});

// ─── Step 2: OAuth2 Callback ──────────────────────────────────────────────────
router.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    // Save tokens to .env or a simple file for persistence
    fs.writeFileSync(
      path.join(__dirname, '../config/gmail_tokens.json'),
      JSON.stringify(tokens)
    );
    res.redirect('http://localhost:5173/email-applications?connected=true');
  } catch (err) {
    res.status(500).json({ error: 'OAuth callback failed', details: err.message });
  }
});

// ─── Helper: Load saved tokens ────────────────────────────────────────────────
const loadTokens = () => {
  const tokenFile = path.join(__dirname, '../config/gmail_tokens.json');
  if (fs.existsSync(tokenFile)) {
    const tokens = JSON.parse(fs.readFileSync(tokenFile));
    oauth2Client.setCredentials(tokens);
    return true;
  }
  return false;
};

// ─── Step 3: Fetch Emails with Attachments ────────────────────────────────────
router.get('/fetch', auth, async (req, res) => {
  try {
    if (!loadTokens()) {
      return res.status(401).json({
        error: 'Not authenticated',
        authUrl: `http://localhost:5000/api/email/auth`,
      });
    }

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const maxResults = parseInt(req.query.limit) || 20;

    // Search for emails with resume attachments
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: 'has:attachment (filename:pdf OR filename:doc OR filename:docx) subject:(resume OR application OR cv OR job)',
      maxResults,
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) {
      return res.json({ emails: [], total: 0 });
    }

    const emailResults = [];

    for (const msg of messages) {
      try {
        const detail = await gmail.users.messages.get({
          userId: 'me',
          id: msg.id,
          format: 'full',
        });

        const headers = detail.data.payload.headers;
        const getHeader = (name) =>
          headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

        const emailData = {
          id: msg.id,
          from: getHeader('From'),
          subject: getHeader('Subject'),
          date: getHeader('Date'),
          snippet: detail.data.snippet,
          attachments: [],
          parsedResume: null,
        };

        // Find attachments
        const parts = detail.data.payload.parts || [];
        const findAttachments = (parts) => {
          for (const part of parts) {
            if (
              part.filename &&
              part.body.attachmentId &&
              (part.filename.endsWith('.pdf') ||
                part.filename.endsWith('.doc') ||
                part.filename.endsWith('.docx'))
            ) {
              emailData.attachments.push({
                filename: part.filename,
                attachmentId: part.body.attachmentId,
                mimeType: part.mimeType,
              });
            }
            if (part.parts) findAttachments(part.parts);
          }
        };
        findAttachments(parts);

        // Parse first attachment with ML service
        if (emailData.attachments.length > 0) {
          try {
            const att = emailData.attachments[0];
            const attRes = await gmail.users.messages.attachments.get({
              userId: 'me',
              messageId: msg.id,
              id: att.attachmentId,
            });

            // Decode base64 attachment
            const buffer = Buffer.from(attRes.data.data, 'base64');
            const tmpPath = path.join(__dirname, `../uploads/tmp_${msg.id}_${att.filename}`);
            fs.writeFileSync(tmpPath, buffer);

            // Send to ML service for parsing
            const form = new FormData();
            form.append('file', fs.createReadStream(tmpPath));
            form.append('jobTitle', 'General');
            form.append('requiredSkills', '');

            const mlRes = await axios.post('http://127.0.0.1:5001/parse', form, {
              headers: { ...form.getHeaders() },
              timeout: 15000,
            });

            emailData.parsedResume = mlRes.data;
            fs.unlinkSync(tmpPath);
          } catch (mlErr) {
            console.warn(`ML parsing failed for ${msg.id}:`, mlErr.message);
          }
        }

        emailResults.push(emailData);
      } catch (msgErr) {
        console.warn(`Failed to process message ${msg.id}:`, msgErr.message);
      }
    }

    res.json({ emails: emailResults, total: emailResults.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch emails', details: err.message });
  }
});

// ─── Step 4: Check connection status ─────────────────────────────────────────
router.get('/status', auth, (req, res) => {
  const connected = loadTokens();
  res.json({
    connected,
    authUrl: connected ? null : `http://localhost:5000/api/email/auth`,
  });
});

module.exports = router;
