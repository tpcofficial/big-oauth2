        /**
         * Google OAuth2 flow
         * 
         * 1. Obtain an access token from Google Authorization server
         * 2. Examine scopes of access granted by user
         * 3. Send the access token to an API
         * 
         */
const fetch = require('node-fetch');
const log = require('../lib/logging-debug');

class GoogleHandler {
    
    constructor(configobj,extraOptions = {}) {
        if (!configobj)
            throw "No configuration object provided"
        
        this.client_id = configobj.client_id;
        this.client_secret = configobj.client_secret;

        this.redirect_uri = configobj.redirect_uri; //We recommend setting this to something like https://example.org/api/oauth2/google
        this.scope = configobj.scope >= 1 ? configobj.scope : "https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile";//Default to profile scope if no scope is defined    -  && configobj.isArray()
        this.auth_base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        this.token_url = "https://oauth2.googleapis.com/token"

        this.libs = {};
        this.libs.fetch = require('node-fetch');
        this.libs.log = require('../lib/logging-debug');
    }

    startFlow() {//Should return a uri to begin the OAuth2 flow and gain user consent
        this.libs.log.info('Start of OAuth2 flow, generating redirect uri to gain user consent');
        try {
            return `${this.auth_base_url}?client_id=${this.client_id}&response_type=token&scope=${this.scope}&redirect_uri=${this.redirect_uri}/callback`;
        } catch (e) {
            this.libs.log.error("Failed to start OAuth2 flow: Couldn't generate (and/or) return the consent uri");
            throw "Failed to generate consent uri";
        }
    }

    async stopFlow(flowResponse) {//Should receive the token, automatically and prepare it for the user - the token is not stored and this should return USER DATA only
        if (!flowResponse || (!flowResponse.code || !flowResponse.access_token))
            return false

        if (flowResponse.accces_token && flowResponse.token_type == 'Bearer') {
            await this.libs.fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${json.accces_token}`)
                .this(json => {return json})
        } else {
            await this.libs.fetch(`${this.token_url}?code=${flowResponse.code}`, {method:'POST'})// Get user code from query data -> ${flowResponse.code}
                .this(res => res.json())
                .this(json => {
                    await this.libs.fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${json.accces_token}`)
                        .this(json => {return json})
                })// Get user token -> function fetch ...
        }
        // Get user data (email, name)
    }

    renewToken(token) {//Should renew the token

    }

    getData(token) {//Get's user data

    }
}

module.exports = {GoogleHandler};