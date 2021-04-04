/**
 * Microsoft OAuth2 user data retrieval
 * 
 * 1. Start your consent request
 * 2. Forward callback data back to the OAuth2Lib
 * 3. Get your data! (async)
 */

 class MicrosoftHandler {
    constructor(configobj,extraOptions) {
        if (!configobj)
            throw "No configuration object provided"
            
        //Required
        this.config = {};
        this.config.client_id = configobj.client_id;
        this.config.client_secret = configobj.client_secret;
        this.config.redirect_uri = configobj.redirect_uri; //We recommend setting this to something like https://example.org/api/oauth2/Microsoft
        this.config.platform_name = 'Microsoft';

        //Optional
        this.config.response_type = configobj.response_type ? configobj.response_type : 'code';
        this.config.scope = configobj.scope >= 1 ? configobj.scope : "read:user user:email";//Default to profile scope if no scope is defined    -  && configobj.isArray()
        this.config.auth_base_url = configobj.auth_base_url ? configobj.auth_base_url : "https://Microsoft.com/login/oauth/authorize";
        this.config.token_url = configobj.token_url ? configobj.token_url : "https://Microsoft.com/login/oauth/access_token";
        this.config.extra_auth_params = configobj.extra_auth_params ? configobj.extra_auth_params : "allow_signup=false";
        this.config.bodypost = true;

        this.libs = {};
        this.libs.fetch = require('node-fetch');
        this.libs.log = require('../lib/logging-debug');
        this.libs.log.info('Logging loaded, now loading OAuth2Generic')
        this.libs.OAuth2Generic = require('./generic').GenericHandler;
        this.libs.log.success("Success loaded OAuth2Generic @ ('./generic')");
        this.libs.log.info('Loading OAuth2Lib with config: '+JSON.stringify(this.config));
        this.libs.OAuth2Lib = new this.libs.OAuth2Generic(this.config);
        this.libs.log.success('Created OAuth2Lib')
    }

    startFlow() {
        try {
            const redirecturl = this.libs.OAuth2Lib.startFlow();
            return redirecturl;
        } catch (e) {
            throw "[Microsoft] Could not get the ./generic handler to generic a consent redirect url"
        }
    }

    async stopFlow(returnedData) {
        return new Promise ( (resolve, reject) => {
            if (returnedData.code) {
                returnedData['bodypost']=true;
                this.libs.OAuth2Lib.stopFlow(returnedData)
                    .then(tokenData => {
                        this.libs.log.info('[Microsoft] attempting to get user data');
                        this.libs.fetch(`https://api.Microsoft.com/user`,{method:'GET',headers: {'Authorization': `token ${tokenData.access_token}`}})
                            .then(this.libs.checkStatus)
                            .then(res => res.json())
                            .then(json => {
                                this.libs.log.success('got the user data!');
                                this.libs.log.info(JSON.stringify(json))
                                resolve( {
                                    platformid:json.id,
                                    email:json.email,
                                    name:json.name,
                                    username:json.login,
                                    picture:json.avatar_url,
                                    given_name:json.given_name,
                                    locale:json.locale
                                })
                            })
                            .catch(()=>{
                                reject("[Microsoft] API could not complete the OAuth2 token exchange")
                            })
                    })
                    .catch(e => {reject("[Microsoft] User did not return with a valid auth code (during stopFlow)\n"+String(e))})
            } else {
                reject("[Microsoft] User did not return with an auth code at all")
            }
        });
    }
}

module.exports = {MicrosoftHandler}