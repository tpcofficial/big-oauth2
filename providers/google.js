        /**
         * Google OAuth2 flow
         * 
         * 1. Obtain an access token from Google Authorization server
         * 2. Examine scopes of access granted by user
         * 3. Send the access token to an API
         * 
         */
const { get, post } = require('snekfetch');

class GoogleHandler {
    
    constructor(configobj,extraOptions) {
        this.client_id = configobj.client_id;
        this.client_secret = configobj.client_secret;

        this.redirect_uri = configobj.redirect_uri;
        this.scope = configobj.scope >= 1 && configobj.isArray() ? configobj.scope : ['profile'];//Default to profile scope if no scope is defined

    }

    startFlow() {//Should return a uri to begin the OAuth2 flow and gain user consent
        console.info('googleflow')
    }

    stopFlow() {//Should receive the token, automatically and prepare it for the user - the token is not stored and this should return USER DATA only
        console.info('googlecallback')
    }

    renewToken(token) {//Should renew the token

    }

    getData(token) {//Get's user data

    }
}

module.exports = {GoogleHandler};