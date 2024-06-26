var express = require('express');
var router = express.Router();
var path = require('path');
var appPath = path.dirname(path.dirname(__dirname));


router.post('/reddit-expand', checkIfLoggedIn, function (req, res, next) {
    s3.list_files(req.body.prefix).then((data) => {

        // check if comment.zip already exist or not
        var exist = false;


        // check if user still wants to collect it; overwrite the exist
        if (exist === false || (exist === true && req.body.consent === 'true')) {
            var jobName = req.user.email + '_RedditComment_sdk';
            var command = ["python3", "/scripts/RedditComment.py",
                "--remoteReadPath", req.body.prefix,
                "--s3FolderName", req.user.email,
                "--email", req.body.email,
                "--sessionURL", req.body.sessionURL];

            batchHandler.batch(
                "arn:aws:batch:us-west-2:083781070261:job-definition/smile_reddit_comment:1",
                jobName,
                "arn:aws:batch:us-west-2:083781070261:job-queue/SMILE_batch",
                "reddit_comment",
                command)
            .then(results => {
                res.end('done');
            })
            .catch(err => {
                res.send({ERROR: err});
            });
        } else if (exist === true && req.body.consent === undefined) {
            res.send('pop alert');
        } else {
            res.end('no information');
        }

    }).catch(err => {
        console.log(err);
    })

});


module.exports = router;
