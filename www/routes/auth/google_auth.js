var googleAuth = require('google-auth-library');
var express = require('express');
var router = express.Router();

var clientId = GOOGLE_CLIENT_ID;
var clientSecret = GOOGLE_CLIENT_SECRET;
var redirectUrl = GOOGLE_CALLBACK_URL;
var auth = new googleAuth();
var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

router.get('/login/google', checkIfLoggedIn, function (req, res, next) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.readonly'],
        // prompt: 'consent' // Prompts the user to consent
    });
    res.redirect(authUrl);
});

router.get('/login/google/callback', checkIfLoggedIn, (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send({ ERROR: 'Code not provided' });
    }

    oauth2Client.getToken(code, (error, tokens) => {
        if (error) {
            return res.status(400).send({ ERROR: error.message });
        }
        setCredential(req, 'google_access_token', tokens.access_token);
        res.redirect('/query');
    });
});



module.exports = router;
