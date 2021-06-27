/*jshint esversion: 8 */
/**
 * Discord OAuth2 user data retrieval
 * 
 * 1. Start your consent request
 * 2. Forward callback data back to the OAuth2Lib
 * 3. Get your data! (async)
 */

class DiscordHandler {
    constructor(configobj,extraOptions) {
        if (!configobj)
            throw "No configuration object provided";
            
        //Required
        this.config = {};
        this.config.client_id = configobj.client_id;
        this.config.client_secret = configobj.client_secret;
        this.config.redirect_uri = configobj.redirect_uri; //We recommend setting this to something like https://example.org/api/oauth2/Discord
        this.config.platform_name = 'Discord';

        //Optional
        this.config.response_type = configobj.response_type ? configobj.response_type : 'code';
        this.config.scope = configobj.scope >= 1 ? configobj.scope : "identify email";//Default to profile scope if no scope is defined    -  && configobj.isArray()
        this.config.auth_base_url = configobj.auth_base_url ? configobj.auth_base_url : "https://discord.com/api/v7/oauth2/authorize";
        this.config.token_url = configobj.token_url ? configobj.token_url : "https://discord.com/api/v7/oauth2/token";
        this.config.extra_auth_params = 'prompt=none'
        this.extra_auth_params = configobj.extra_auth_params ? '&'+configobj.extra_auth_params : '';
        
        this.libs = {};
        this.libs.fetch = require('node-fetch');
        this.libs.log = require('../lib/logging-debug');
        this.libs.log.info('Logging loaded, now loading OAuth2Generic');
        this.libs.OAuth2Generic = require('./generic').GenericHandler;
        this.libs.log.success("Success loaded OAuth2Generic @ ('./generic')");
        this.libs.log.info('Loading OAuth2Lib with config: '+JSON.stringify(this.config));
        this.libs.OAuth2Lib = new this.libs.OAuth2Generic(this.config);
        this.libs.log.success('Created OAuth2Lib');
    }

    startFlow() {
        try {
            const redirecturl = this.libs.OAuth2Lib.startFlow();
            return redirecturl;
        } catch (e) {
            throw "[Discord] Could not get the ./generic handler to generic a consent redirect url";
        }
    }

    async stopFlow(returnedData) {
        return new Promise ( async (resolve, reject) => {
            if (returnedData.code) {
                returnedData.bodypost=true;
                this.libs.OAuth2Lib.stopFlow(returnedData)
                    .then(tokenData => {
                        this.libs.log.info('[Discord] attempting to get user data');
                        this.libs.fetch(`https://discord.com/api/v7/users/@me`,{method:'GET',headers: {'Authorization': `Bearer ${tokenData.access_token}`}})
                            .then(this.libs.checkStatus)
                            .then(res => res.json())
                            .then(json => {
                                this.libs.log.success('got the user data!');
                                this.libs.log.info(JSON.stringify(json));
                                resolve( {
                                    platformid:json.id,
                                    email:json.email,
                                    name:json.name,
                                    username:json.username,
                                    picture:`https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png`, // https://github.com/wohali/oauth2-discord-new/issues/14
                                    given_name:null,
                                    locale:json.locale,
                                    platform: 'discord'
                                });
                            })
                            .catch(()=>{
                                reject("[Discord] API could not complete the OAuth2 token exchange");
                            });
                    })
                    .catch(e => {reject("[Discord] User did not return with a valid auth code (during stopFlow)\n"+String(e));});
            } else {
                reject("[Discord] User did not return with an auth code at all");
            }
        });
    }
}

module.exports = {DiscordHandler};
