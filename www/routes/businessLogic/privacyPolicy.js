var express = require('express');
var router = express.Router();

router.get('/privacy-policy', function (req, res) {
    res.render('privacy-policy', {
        user: req.user,
        parent: '/',
        SINGLE_USER:SINGLE_USER
    });
});

module.exports = router;
