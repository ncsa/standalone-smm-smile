var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var fs = require('fs');
var jsonexport = require('jsonexport');
var path = require('path');
var appPath = path.dirname(path.dirname(__dirname));
var getMultiRemote = require(path.join(appPath, 'scripts', 'helper_func', 'getRemote.js'));

router.get('/authorized', checkIfLoggedIn, function (req, res) {
    checkAuthorized(req).then(status => {
        res.send(status);
    })
    .catch(checkAuthorizedError => {
        res.send({ERROR: checkAuthorizedError});
    })
});

router.get('/query', checkIfLoggedIn, function (req, res) {
    checkAuthorized(req).then(status => {
        res.render('search/query', {
            user: req.user,
            parent: '/',
            error: req.query.error,
            SINGLE_USER: SINGLE_USER,
            CLOWDER_ON: CLOWDER_ON,
            REDDIT_ON: REDDIT_ON,
            GOOGLE_ON: GOOGLE_ON,
            status: status,
        });
    })
    .catch(checkAuthorizedError => {
        res.send({ERROR: checkAuthorizedError.message});
    });
});

router.post('/query-dryrun', checkIfLoggedIn, function (req, res) {
    checkAuthorized(req).then(async status => {
        var platform = req.body.prefix.split('-')[0];

        if (status[platform] || req.body.prefix === 'reddit-Historical-Post' || req.body.prefix === 'reddit-Historical-Comment') {
            var obj = await retrieveCredentials(req);
            var headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'redditaccesstoken': obj['rd_access_token'],
                'googleaccesstoken': obj['google_access_token'],
                'googleapikey': obj['google_api_key'],
                'twtaccesstokenkey': obj['twt_access_token_key'],
                'twtaccesstokensecret': obj['twt_access_token_secret'],
                'twtbearertoken': obj['twt_v2_access_token']
            };

            gatherSinglePost(req, headers).then(responseObj => {
                var key1 = Object.keys(responseObj)[0];
                var key2 = Object.keys(responseObj[key1])[0];
                var key3 = Object.keys(responseObj[key1][key2])[0];
                res.send({
                    rendering: responseObj[key1][key2][key3]
                });
            })
            .catch(gatherSinglePostError => {
                res.send({ERROR: gatherSinglePostError});
            });
        } else {
            res.send({ERROR: platform + " token expired! Please refresh the page."});
        }
    })
    .catch(checkAuthorizedError => {
        res.send({ERROR: checkAuthorizedError});
    });
});

router.post('/query', checkIfLoggedIn, function (req, res) {
    checkAuthorized(req).then(async status => {
        var platform = req.body.prefix.split('-')[0];
        if (status[platform] || req.body.prefix === 'reddit-Historical-Post' || req.body.prefix === 'reddit-Historical-Comment') {
            var obj = await retrieveCredentials(req);
            var prefixGraphqlDownloadsDir = createLocalFolders(req);
            checkExist(req.user.email + '/GraphQL/' + req.body.prefix + '/', req.body.filename)
            .then((value) => {
                if (value) {
                    var headers = {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'redditaccesstoken': obj['rd_access_token'],
                        'googleaccesstoken': obj['google_access_token'],
                        'googleapikey': obj['google_api_key'],
                        'twtaccesstokenkey': obj['twt_access_token_key'],
                        'twtaccesstokensecret': obj['twt_access_token_secret'],
                        'twtbearertoken': obj['twt_v2_access_token']
                    };

                    var multiPostPromises = [];
                    if (parseInt(req.body.pages) !== -999) {
                        if (req.body.prefix === 'twitter-Tweet'
                            || req.body.prefix === 'twitter-Timeline'
                            || req.body.prefix === 'youtube-Search-Video'
                            || req.body.prefix === 'youtube-Search-Channel'
                            || req.body.prefix === 'youtube-Search-Playlist'
                            || req.body.prefix === 'youtube-Most-Popular'
                            || req.body.prefix === 'youtube-Creator-Videos'
                        ) {
                            // post one time with all pages
                            multiPostPromises.push(gatherMultiPost(req, headers, parseInt(req.body.pages)));
                        } else {
                            // flipping through pages
                            for (var i = 0; i < parseInt(req.body.pages); i++) {
                                multiPostPromises.push(gatherMultiPost(req, headers, i + 1));
                            }
                        }
                    } else {
                        // no pagination available
                        multiPostPromises.push(gatherSinglePost(req, headers));
                    }
                    Promise.all(multiPostPromises).then(values => {
                        // piece the json together here
                        var key1 = Object.keys(values[0])[0];
                        var key2 = Object.keys(values[0][key1])[0];
                        var key3 = Object.keys(values[0][key1][key2])[0];
                        if ("errors" in values[0]) {
                            res.send({ERROR: values[0]['errors'][0]['message']});
                        } else {
                            var responseObj = mergeJSON(values, [key1, key2, key3]);

                            // ------------------------------------save csv file---------------------------------------------------------
                            if (responseObj[key1][key2][key3].length > 0
                                && responseObj[key1][key2][key3] !== 'null'
                                && responseObj[key1][key2][key3] !== undefined) {

                                // if no such folder, create that folder
                                var directory = path.join(prefixGraphqlDownloadsDir, req.body.filename);
                                if (!fs.existsSync(directory)) {
                                    fs.mkdirSync(directory);
                                }

                                // save query parameters to it so history page can use it! Synchronous method
                                var params = JSON.parse(req.body.params);
                                if (parseInt(req.body.pages) !== -999) params['pages:'] = parseInt(req.body.pages);
                                if (params['fields'] === "") params['fields'] = "DEFAULT";
                                fs.writeFileSync(path.join(directory, "config.json"), JSON.stringify(params), 'utf8');

                                // save json for future pagination purpose
                                // due to [{xxx:xxx},{xxx:xxx}...] is not a valid json format
                                var jsonObj = {};
                                jsonObj[req.body.prefix] = responseObj[key1][key2][key3];
                                var rawJson = req.body.filename + '.json';
                                fs.writeFileSync(path.join(directory, rawJson), JSON.stringify(jsonObj, null, 2), 'utf8');

                                // save CSV; Async
                                var processed = req.body.filename + '.csv';
                                new Promise((resolve, reject) => {
                                    jsonexport(jsonObj[req.body.prefix], {
                                        fillGaps: false,
                                        undefinedString: 'NaN'
                                    }, function (err, csv) {
                                        if (err) reject(err);
                                        if (csv !== '') {
                                            fs.writeFile(path.join(directory, processed), csv, 'utf8', function (err) {
                                                if (err) {
                                                    reject(err);
                                                } else {
                                                    resolve();
                                                }
                                            });
                                        }
                                    });
                                })
                                .then(() => {
                                    var uploadToS3Promises = [];
                                    uploadToS3Promises.push(s3.uploadToS3(path.join(directory, processed),
                                        req.user.email + '/GraphQL/' + req.body.prefix + '/' + req.body.filename + '/' + processed));
                                    uploadToS3Promises.push(s3.uploadToS3(path.join(directory, rawJson),
                                        req.user.email + '/GraphQL/' + req.body.prefix + '/' + req.body.filename + '/' + rawJson));
                                    uploadToS3Promises.push(s3.uploadToS3(path.join(directory, "config.json"),
                                        req.user.email + '/GraphQL/' + req.body.prefix + '/' + req.body.filename + '/' + "config.json"));
                                    Promise.all(uploadToS3Promises).then((URLs) => {
                                        var args = {
                                            's3FolderName': req.user.email,
                                            'filename': processed,
                                            'remoteReadPath': req.user.email + '/GraphQL/' + req.body.prefix + '/' + req.body.filename + '/'
                                        };

                                        lambdaHandler.invoke('histogram', 'histogram', args).then(results => {
                                            if (results['url'] === 'null') {
                                                var rendering = responseObj[key1][key2][key3].slice(0, 100);
                                                s3.deleteLocalFolders(directory).then(() => {
                                                    res.send({
                                                        fname: processed,
                                                        URLs: URLs,
                                                        rendering: rendering
                                                    });
                                                }).catch(deleteLocalFoldersError => {
                                                    res.send({ERROR: deleteLocalFoldersError});
                                                });
                                            } else {
                                                getMultiRemote(results['url']).then(function (data) {

                                                    var histogram = data;
                                                    var rendering = responseObj[key1][key2][key3].slice(0, 100);
                                                    s3.deleteLocalFolders(directory).then(() => {
                                                        res.send({
                                                            fname: processed,
                                                            URLs: URLs,
                                                            rendering: rendering,
                                                            histogram: histogram
                                                        });
                                                    }).catch(deleteLocalFoldersError => { // deleteFolderERROR
                                                        res.send({ERROR: deleteLocalFoldersError});
                                                    });
                                                }).catch(getMultiRemoteError => {
                                                    res.send({ERROR: getMultiRemoteError});
                                                });
                                            }

                                        }).catch(lambdaHandlerError => {
                                            res.send({'ERROR': lambdaHandlerError});
                                        });

                                    }).catch(uploadToS3Error => {
                                        res.send({ERROR: JSON.stringify(uploadToS3Error)});
                                    });

                                }).catch(jsonexportError => {
                                    res.send({ERROR: JSON.stringify(jsonexportError)});
                                });

                            } else {
                                res.send({ERROR: "Sorry, we couldn't find results that matches your query..."});
                            }
                        }

                    }).catch((gatherMultiPostError) => {
                        res.send({ERROR: JSON.stringify(gatherMultiPostError)});
                    })
                } else {
                    res.send({ERROR: 'This filename ' + req.body.filename + ' already exist in your directory. ' +
                            'Please rename it to something else!'});
                }
            })
            .catch(checkExistError => {
                res.send({ERROR: checkExistError });
            });
        }
        else {
            res.send({ERROR: platform + " token expired! Please refresh the page."})
        }
    }).catch(checkAuthorizedError => {
        res.send({ERROR: checkAuthorizedError});
    });
});

router.post('/prompt', checkIfLoggedIn, async function (req, res) {
    var obj = await retrieveCredentials(req);
    lambdaHandler.invoke('bae_screen_name_prompt', 'bae_screen_name_prompt', {
        consumer_key: TWITTER_CONSUMER_KEY,
        consumer_secret: TWITTER_CONSUMER_SECRET,
        access_token: obj['twt_access_token_key'],
        access_token_secret: obj['twt_access_token_secret'],
        screen_name: req.body.screenName
    })
    .then(userinfo => {
        res.send(userinfo);
    })
    .catch(lambdaHandlerError => {
        res.send({ERROR: lambdaHandlerError});
    });
});

/****************************************************************** helper *****************************************************************************************/
function createLocalFolders(req) {
    if (!fs.existsSync(smileHomePath)) {
        fs.mkdirSync(smileHomePath);
    }
    // if that user path doesn't exist
    if (!fs.existsSync(path.join(smileHomePath, req.user.email))) {
        fs.mkdirSync(path.join(smileHomePath, req.user.email));
    }

    var downloadsDir = path.join(smileHomePath, req.user.email, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
        fs.mkdirSync(downloadsDir);
    }

    var graphqlDownloadsDir = path.join(downloadsDir, 'GraphQL');
    if (!fs.existsSync(graphqlDownloadsDir)) {
        fs.mkdirSync(graphqlDownloadsDir);
    }
    var prefixGraphqlDownloadsDir = path.join(graphqlDownloadsDir, req.body.prefix);
    if (!fs.existsSync(prefixGraphqlDownloadsDir)) {
        fs.mkdirSync(prefixGraphqlDownloadsDir);
    }

    return prefixGraphqlDownloadsDir;
}

function checkExist(remotePrefix, localFolderName) {
    var p = s3.list_folders(remotePrefix);
    return p.then(folderObj => {
        var subFolders = Object.keys(folderObj);
        for (var i = 0, length = subFolders.length; i < length; i++) {
            if (subFolders[i].toLowerCase() === localFolderName.toLowerCase()) {
                return false;
            }
        }
        return true;
    });
}
function _containsKeyword(errorMsg) {
    // Define a list of potential keywords related to API key, access token, auth, etc.
    const keywords = [
        "api key",
        "token",
        "access token",
        "auth",
        "authentication",
        "authorization",
        "credentials",
        "invalid token",
        "expired token",
        "invalid credentials",
        "unauthorized",
        "permission denied",
        "forbidden",
        "credentials",
        "login",
        "logout",
        "session",
        "expired session",
        "invalid credentials",
        "invalid api key",
        "invalid access token",
        "expired api key",
        "expired access token",
        "missing api key",
        "missing access token"
    ];
    errorMsg = errorMsg.toLowerCase();
    return keywords.some(keyword => errorMsg.includes(keyword.toLowerCase()));
}

function gatherMultiPost(req, headers, pageNum) {
    // user regex to add a pages:pageNum in the query here
    var query = req.body.query;
    if (pageNum !== -999) {
        query = query.replace(/(\) *{)/g, ",pages:" + pageNum + "$1");
    }

    var platform = req.body.prefix.split('-')[0];

    return new Promise((resolve, reject) => {
        fetch(SMILE_GRAPHQL_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"query": query})
        }).then(function (response) {
            return response.text();
        }).then(function (responseBody) {
            responseBody = responseBody.replace(/\\r/g, '');
            var responseObj = JSON.parse(responseBody);
            if (responseObj !== undefined && responseObj['errors'] !== undefined) {
                if (responseObj['errors'] &&
                    responseObj['errors'].length > 0 &&
                    responseObj['errors'][0]["message"] &&
                    _containsKeyword(responseObj['errors'][0]["message"])) {
                        removeInvalidToken(req, platform);
                        console.log("Invalid token detected. Token removed.");
                }

                reject(responseObj['errors']);
            } else {
                resolve(responseObj);
            }
        }).catch((fetchError) => {
            reject(fetchError);
        });
    });
}

function gatherSinglePost(req, headers) {
    var platform = req.body.prefix.split('-')[0];

    return new Promise((resolve, reject) => {
        fetch(SMILE_GRAPHQL_URL, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({"query": req.body.query})
        }).then(function (response) {
            return response.text();
        }).then(function (responseBody) {
            responseBody = responseBody.replace(/\\r/g, '');
            var responseObj = JSON.parse(responseBody);
            if (responseObj !== undefined && responseObj['errors'] !== undefined) {
                if (responseObj['errors'] &&
                    responseObj['errors'].length > 0 &&
                    responseObj['errors'][0]["message"] &&
                    _containsKeyword(responseObj['errors'][0]["message"])) {
                    removeInvalidToken(req, platform);
                    console.log("Invalid token detected. Token removed.");
                }

                reject(responseObj['errors']);
            } else {
                resolve(responseObj);
            }
        }).catch((fetchError) => {
            reject(fetchError);
        });
    });
}

function removeInvalidToken(req, platform) {
    if (platform === 'twitter') {
        removeCredential(req, 'twt_access_token_key');
        removeCredential(req, 'twt_access_token_secret');
    }
    else if (platform === 'twitterV2') {
        removeCredential(req, 'twt_v2_access_token');
    } else if (platform === 'reddit') {
        removeCredential(req, 'rd_access_token');
    } else if (platform === 'youtube') {
        removeCredential(req, 'google_access_token');
        removeCredential(req, 'google_api_key');
    }
}

function mergeJSON(values, keys) {
    /* {
        data{
            twitter{
                ...
            }
        }
    }*/

    var newJSON = {};
    newJSON[keys[0]] = {};
    newJSON[keys[0]][keys[1]] = {};
    newJSON[keys[0]][keys[1]][keys[2]] = [];

    for (var i = 0; i < values.length; i++) {
        newJSON[keys[0]][keys[1]][keys[2]] = newJSON[keys[0]][keys[1]][keys[2]].concat(values[i][keys[0]][keys[1]][keys[2]]);
    }

    return newJSON;
}

function checkAuthorized(req) {
    return new Promise(async (resolve, reject) => {
        var response = {
            twitter: false,
            twitterV2: false,
            reddit: false,
            youtube: false
        };
        var obj = await retrieveCredentials(req);

        if (obj && 'twt_access_token_key' in obj && 'twt_access_token_secret' in obj) response['twitter'] = true;
        if (obj && 'twt_v2_access_token' in obj) response['twitterV2'] = true;
        if (obj && 'rd_access_token' in obj) response['reddit'] = true;
        if (obj && ('google_access_token' in obj || 'google_api_key' in obj)) response['youtube'] = true;
        resolve(response);
    });
}

module.exports = router;
