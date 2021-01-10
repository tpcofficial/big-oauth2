        /**
         * Google OAuth2 flow
         * 
         * 1. Obtain an access token from Google Authorization server
         * 2. Examine scopes of access granted by user
         * 3. Send the access token to an API
         * 
         */
const fetch = require('node-fetch');

class GoogleHandler {
    
    constructor(configobj,extraOptions) {
        this.client_id = configobj.client_id;
        this.client_secret = configobj.client_secret;

        this.redirect_uri = configobj.redirect_uri; //We recommend settings this to something like https://example.org/api/oauth2/google
        this.scope = configobj.scope >= 1 ? configobj.scope : "userinfo.profile userinfo.email";//Default to profile scope if no scope is defined    -  && configobj.isArray()
        this.auth_base_url = "https://accounts.google.com/o/oauth2/v2/auth"
        this.token_url = "https://www.googleapis.com/oauth2/v4/token"
    }

    startFlow() {//Should return a uri to begin the OAuth2 flow and gain user consent
        const body = {};
        fetch(`${this.auth_base_url}?client_id=${this.client_id}&response_type=token&scope=${this.scope}&redirect_uri=${this.redirect_uri}/callback`,
            {
                method: 'GET',
            })
            .then(res => res.json())
            .then(json => { try { return (JSON.parse(json)) } catch (e) {throw "bad response"} })
        console.info('googleflow')
    }

    stopFlow(flowResponse) {//Should receive the token, automatically and prepare it for the user - the token is not stored and this should return USER DATA only
        if (!flowResponse)
            return false
        console.info('googlecallback')
    }

    renewToken(token) {//Should renew the token

    }

    getData(token) {//Get's user data

    }
}

module.exports = {GoogleHandler};