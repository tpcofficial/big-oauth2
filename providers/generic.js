        /**
         * Generic OAuth2 flow
         * 
         * 1. Obtain an access token from Google Authorization server
         * 2. Examine scopes of access granted by user
         * 3. Send the access token to an API
         * 
         */
class GenericHandler {

    constructor(configobj,extraOptions = {}) {
        if (!configobj)
            throw "No configuration object provided"
            
        //Required
        this.client_id = configobj.client_id;
        this.client_secret = configobj.client_secret;
        this.redirect_uri = configobj.redirect_uri; //We recommend setting this to something like https://example.org/api/oauth2/google
        this.auth_base_url = configobj.auth_base_url
        this.token_url = configobj.token_url

        //Optional
        this.response_type = configobj.response_type ? configobj.response_type : null;
        this.scope = configobj.scope ? configobj.scope : null;//Default to profile scope if no scope is defined    -  && configobj.isArray()
        this.platform_name = configobj.platform_name ? configobj.platform_name : 'generic';

        this.libs = {};
        this.libs.fetch = require('node-fetch');
        this.libs.log = require('../lib/logging-debug');
        this.libs.checkStatus = (res) => {if (res.ok) {return res} else { console.log(res); throw "Unhealthy response"}};
    }

    startFlow() {//Should return a uri to begin the OAuth2 flow and gain user consent
        this.libs.log.info(`[${this.platform_name}] Start of OAuth2 flow, generating redirect uri to gain user consent`);
        try {
            return `${this.auth_base_url}?client_id=${this.client_id}&response_type=${this.response_type}&scope=${this.scope}&redirect_uri=${this.redirect_uri}/callback`;
        } catch (e) {
            this.libs.log.error(`[${this.platform_name}] Failed to start OAuth2 flow: Couldn't generate (and/or) return the consent uri`);
            throw `[${this.platform_name}] Failed to generate consent uri\n${e}`;
        }
    }

    async stopFlow(flowResponse) {//Should receive the token, automatically and prepare it for the user - the token is not stored and this should return USER DATA only
        return new Promise (async (resolve, reject) => {
            if (flowResponse.code) {
                this.libs.log.info(`[${this.platform_name}] Code spotted, exchanging`);
                //console.log(`${this.token_url}?code=${flowResponse.code}&client_id=${this.client_id}&client_secret=${this.client_secret}&redirect_uri=${this.redirect_uri}/callback&scope=${this.scope}&grant_type=authorization_code`)
                if (!flowResponse.bodypost) {
                    this.libs.log.info(`[${this.platform_name}] Query method POST exchange`)
                    this.libs.fetch(`${this.token_url}?code=${flowResponse.code}&client_id=${this.client_id}&client_secret=${this.client_secret}&redirect_uri=${this.redirect_uri}/callback&scope=${this.scope}&grant_type=authorization_code`, {method:'POST'})// Get user code from query data -> ${flowResponse.code}
                        .then(this.libs.checkStatus)
                        .then(res => res.json())
                        .then(json => {
                            //this.libs.fetch(``,{method:`GET`,headers:{'Authorization':`Bearer ${res.json.access_token}`}})
                            if (json.access_token) {
                                this.libs.log.success(`[${this.platform_name}] code exchange was successful`);
                                resolve(json);
                            } else {
                                this.libs.log.error(`[${this.platform_name}] code exchange failed`);
                                reject(`[${this.platform_name}] failed to complete the code excahnge`);
                            }
                        })
                        .catch(e => {
                            this.libs.log.warn(`[${this.platform_name}] failed to give us a valid access_token`);
                            reject(`[${this.platform_name}] failed to run through the code exchange flow\n+${String(e)}`);
                        })
                } else {
                    const {URLSearchParams} = require('url');
                    const params = new URLSearchParams({
                        code:flowResponse.code,
                        client_id:this.client_id,
                        client_secret:this.client_secret,
                        redirect_uri:this.redirect_uri,
                        scope:this.scope,
                        grant_type:'authorization_code'
                    });
                    this.libs.log.info(`[${this.platform_name}] Form body method POST exchange ${flowResponse.bodypost}`)
                    this.libs.log.info(`${this.token_url}    |    ${params.toString()}`)
                    /*this.libs.fetch(`${this.token_url}`, {method:'POST',body: params})// Get user code from query data -> ${flowResponse.code}
                        .then(this.libs.checkStatus)
                        .then(res => res.json())
                        .then(json => {
                            //this.libs.fetch(``,{method:`GET`,headers:{'Authorization':`Bearer ${res.json.access_token}`}})
                            if (json.access_token) {
                                this.libs.log.success(`[${this.platform_name}] code exchange was successful`);
                                resolve(json);
                            } else {
                                this.libs.log.warn(`[${this.platform_name}] code exchange failed`);
                                reject(`[${this.platform_name}] failed to complete the code excahnge`);
                            }
                        })
                        .catch(e => {
                            this.libs.log.error(`[${this.platform_name}] failed to give us a valid access_token`);
                            reject(`[${this.platform_name}] failed to run through the code exchange flow\n+${String(e)}`);
                        })*/
                }
            } else {
                this.libs.log.error('Google did not give us valid data\n'+JSON.stringify(flowResponse));
                reject(`[${this.platform_name}] API did not respond with a valid authentication code or token`);
            }
        })
        // Get user data (email, name)
    }

    renewToken(renew_token) { //Should renew the token
        throw "Unimplemented"+token
    }
}

module.exports = {GenericHandler};