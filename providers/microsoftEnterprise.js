        /**
         * AAD OAuth2 flow
         * 
         * 1. Obtain an access token from a Microsoft Graph Authorization server
         * 2. Examine scopes of access granted by user
         * 3. Send the access token to an API
         * 
         */
        class AADHandler {

            constructor(configobj,extraOptions = {}) {
                if (!configobj)
                    throw "No configuration object provided"
                    
                //Required
                this.client_id = configobj.client_id;
                this.client_secret = configobj.client_secret;
                this.redirect_uri = configobj.redirect_uri; //We recommend setting this to something like https://example.org/api/oauth2/AAD
        
                //Optional
                this.response_type = configobj.response_type ? configobj.response_type : 'code';
                this.scope = configobj.scope >= 1 ? configobj.scope : "https://www.AADapis.com/auth/userinfo.email+https://www.AADapis.com/auth/userinfo.profile";//Default to profile scope if no scope is defined    -  && configobj.isArray()
                this.auth_base_url = "https://accounts.AAD.com/o/oauth2/v2/auth"
                this.token_url = "https://oauth2.AADapis.com/token"
        
                this.libs = {};
                this.libs.fetch = require('node-fetch');
                this.libs.log = require('../lib/logging-debug');
                this.libs.checkStatus = (res) => {if (res.ok) {return res} else { console.log(res); throw "Unhealthy response"}};
            }
        
            startFlow() {//Should return a uri to begin the OAuth2 flow and gain user consent
                this.libs.log.info('Start of OAuth2 flow, generating redirect uri to gain user consent');
                try {
                    return `${this.auth_base_url}?client_id=${this.client_id}&response_type=${this.response_type}&scope=${this.scope}&redirect_uri=${this.redirect_uri}/callback`;
                } catch (e) {
                    this.libs.log.error("Failed to start OAuth2 flow: Couldn't generate (and/or) return the consent uri");
                    throw "Failed to generate consent uri";
                }
            }
        
            async stopFlow(flowResponse) {//Should receive the token, automatically and prepare it for the user - the token is not stored and this should return USER DATA only
                return new Promise (async (resolve, reject) => {
                    if (flowResponse.code || flowResponse.access_token) {
                        if (flowResponse.access_token && flowResponse.token_type == 'Bearer') {
                            this.libs.log.info('access_token spotted, using this to get data');
                            await this.libs.fetch(`https://www.AADapis.com/oauth2/v3/tokeninfo?id_token=${json.access_token}`)
                                .this(json => {return json})
                        } else if (flowResponse.code) {
                            this.libs.log.info('code spotted, exchanging');
                            console.log(`${this.token_url}?code=${flowResponse.code}&client_id=${this.client_id}&client_secret=${this.client_secret}&redirect_uri=${this.redirect_uri}/callback&scope=${this.scope}&grant_type=authorization_code`)
                            this.libs.fetch(`${this.token_url}?code=${flowResponse.code}&client_id=${this.client_id}&client_secret=${this.client_secret}&redirect_uri=${this.redirect_uri}/callback&scope=${this.scope}&grant_type=authorization_code`, {method:'POST'})// Get user code from query data -> ${flowResponse.code}
                                .then(this.libs.checkStatus)
                                .then(res => res.json())
                                .then(json => {
                                    //this.libs.fetch(``,{method:`GET`,headers:{'Authorization':`Bearer ${res.json.access_token}`}})
                                    this.libs.log.success('code exchange was successful');
                                    console.log(JSON.stringify(json));
                                    this.libs.log.info('attempting to get user data');
                                    this.libs.fetch(`https://www.AADapis.com/oauth2/v3/tokeninfo?id_token=${json.id_token}`)
                                        .then(this.libs.checkStatus)
                                        .then(res => res.json())
                                        .then(json => {
                                            this.libs.log.success('got the user data!');
                                            this.libs.log.info(JSON.stringify(json))
                                            resolve( {
                                                platformid:json.sub,
                                                email:json.email,
                                                name:json.name,
                                                picture:json.picture,
                                                given_name:json.given_name,
                                                locale:json.locale
                                            })
                                        })
                                        .catch(()=>{
                                            reject("[AAD] API could not complete the OAuth2 token exchange")
                                        })
                                })
                        }
                    } else {
                        this.libs.log.error('AAD did not give us valid data\n'+JSON.stringify(flowResponse));
                        reject("[AAD] API did not respond with a valid authentication code or token");
                    }
                })
                // Get user data (email, name)
            }
        
            renewToken(token) { //Should renew the token
                throw "Unimplemented"+token
            }
        
            getData(token) { //Get's user data
            throw "Unimplemented"+token
            }
        }
        
        module.exports = {AADHandler};