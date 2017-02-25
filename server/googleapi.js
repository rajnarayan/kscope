'use strict';

module.exports = function () {
    let ctrl        = this;

    var fs          = require('fs');
    var readline    = require('readline');
    var google      = require('googleapis');
    var googleAuth  = require('googleapis/node_modules/google-auth-library');
    var util        = require('util');
    
    // If modifying these scopes, delete your previously saved credentials
    // at ~/.credentials/drive-nodejs-quickstart.json
    var SCOPES      = [
        'https://www.googleapis.com/auth/drive.metadata.readonly', 
        'https://www.googleapis.com/auth/youtube'
    ];
    var TOKEN_DIR   = (process.env.HOME || process.env.HOMEPATH ||
    		 process.env.USERPROFILE) + '/.credentials/';
    var TOKEN_PATH  = TOKEN_DIR + 'kscope-nodejs-googleapi.json';


    ctrl.initState = (callback) => {
        // Load client secrets from a local file.
        fs.readFile('client_secret.json', function processClientSecrets(err, content) {
        	if (err) {
        	    console.log('Error loading client secret file: ' + err);
        	    return;
        	}
        	// Authorize a client with the loaded credentials, then call the
        	// Drive API.
        	//	authorize(JSON.parse(content), listFiles);
		//    	ctrl.authorize(JSON.parse(content), youtubeSearch);
        	return ctrl.authorize(JSON.parse(content), callback);
            });
    }
    
    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     *
     * @param {Object} credentials The authorization client credentials.
     * @param {function} callback The callback to call with the authorized client.
     */
    ctrl.authorize = (credentials, callback) => {
    	console.log(credentials);
        var clientSecret = credentials.web.client_secret;
        var clientId = credentials.web.client_id;
        var redirectUrl = credentials.web.redirect_uris[0];
        var auth = new googleAuth();
        var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    
        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function(err, token) {
    	    if (err) {
    		ctrl.getNewToken(oauth2Client, callback);
    	    } else {
    		oauth2Client.credentials = JSON.parse(token);
		console.log("credentials");
                console.log(oauth2Client);
    		if(callback)
                    callback(oauth2Client);
                else
                    return oauth2Client;
    	    }
    	});
    }
    
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    ctrl.getNewToken = (oauth2Client, callback) => {
        var authUrl = oauth2Client.generateAuthUrl({
    	    access_type: 'offline',
    	    scope: SCOPES
    	});
        console.log('Authorize this app by visiting this url: ', authUrl);
        var rl = readline.createInterface({
    	    input: process.stdin,
    	    output: process.stdout
    	});
        rl.question('Enter the code from that page here: ', function(code) {
    	    rl.close();
    	    oauth2Client.getToken(code, function(err, token) {
    		    if (err) {
    			console.log('Error while trying to retrieve access token', err);
    			return;
    		    }
    		    oauth2Client.credentials = token;
    		    ctrl.storeToken(token);
    		    //callback(oauth2Client);
    		});
    	});
    }
    
    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    ctrl.storeToken = (token) => {
        try {
    	fs.mkdirSync(TOKEN_DIR);
        } catch (err) {
    	if (err.code != 'EEXIST') {
    	    throw err;
    	}
        }
        fs.writeFile(TOKEN_PATH, JSON.stringify(token));
        console.log('Token stored to ' + TOKEN_PATH);
    }
    
    /**
     * Lists the names and IDs of up to 10 files.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    ctrl.listFiles = (auth) => {
        var service = google.drive('v3');
        service.files.list({
    	    auth: auth,
    		pageSize: 10,
    		fields: "nextPageToken, files(id, name)"
    		}, function(err, response) {
    	    if (err) {
    		console.log('The API returned an error: ' + err);
    		return;
    	    }
    	    var files = response.files;
    	    if (files.length == 0) {
    		console.log('No files found.');
    	    } else {
    		console.log('Files:');
    		for (var i = 0; i < files.length; i++) {
    		    var file = files[i];
    		    console.log('%s (%s)', file.name, file.id);
    		}
    	    }
    	});
    }
    
    /**
     * Lists the names and IDs of up to 10 files.
     *
     * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
     */
    ctrl.youtubeSearch = (query, callback, auth) => {
       ctrl.initState(function (auth) {
           console.log("Auth Header");
           console.log(auth);
           var service = google.youtube('v3');
            service.search.list({
        	    auth: auth,
                part: 'id,snippet',
                q: query
    	    }, callback);
       });
    }

}