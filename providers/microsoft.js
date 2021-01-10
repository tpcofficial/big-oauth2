class MicrosoftHandler {
    constructor(configobj,extraOptions) {
        this.client_id = configobj.client_id;
        this.client_secret = configobj.client_secret;

        this.redirect_uri = configobj.redirect_uri;
    }
}

module.exports = {MicrosoftHandler}