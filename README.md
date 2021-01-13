# big-oauth2

![Node.js Package](https://github.com/tpcofficial/big-oauth2/workflows/Node.js%20Package/badge.svg)

A Node.js module for OAuth2 to easily allow you to integrate your applications authentication with 3rd party IdPs. Returns user data with minimal code to help you create and manage users in your databases!

## Note

For purely concept, may use premade authentication libraries for the OAuth2 APIs offered by the services, we'll then work on replacing the libraries for http requests using `node-fetch`

## The big-oauth2 project

OAuth2 can be complicated and annoying, so we're trying to make it simpler!

big-oauth2 is a project aimed at simplifying the OAuth2 flow for people who are new to using the standard, this helps improve the security of authentication on new web applications as well as making them easier to access.

This project is ran for free by the public and we hope to make your life simpler!

### Parts of the project

- [big-oauth2](https://github.com/tpcofficial/big-oauth2) (An npm package for the project, this is our main priority at the moment)
- [big-oauth2-express](https://github.com/tpcofficial/big-oauth2-express) (An npm package to easily implement routes for the OAuth2 flow)

## Usage (hopefully)

```js
//We will make an actual usage demo in the future, here's a reduced version of our testing script to suffice while we work on one!
const log = require('@tpcofficial/pretty-text');

log.info('Loading big-oauth2');
const OAuth2Lib = require('@tpcofficial/big-oauth2');

log.info('Loading express');
const express = require('express');
const { exit } = require('process');

log.info('Creating new express app and defining routes');
const app = new express();
const router = express.Router();

//Discord testing imports
log.info('Creating Discord config');
const discordtestconfig = {
    client_id: '123456',
    client_secret: 'a-123456',
    redirect_uri: 'http://localhost/oauth2/discord'
};

//Discord
log.info('Going to attempt to create Discord OAuth2 handler');
try {
    const DiscordOAuth = new OAuth2Lib.discord.DiscordHandler(discordtestconfig);
} catch (e) {
    log.error('[Discord] Failed to create the object requested.\n'+e);;
    throw e
}
const DiscordOAuth = new OAuth2Lib.discord.DiscordHandler(discordtestconfig);

//Discord
router.get('/discord/authorize', (req, res, next) => {
    const redirurl = DiscordOAuth.startFlow();
    res.redirect(redirurl);
})
router.get('/discord/callback', async (req, res, next) => {
    const userdata = await DiscordOAuth.stopFlow({code:req.query.code})
    if (userdata) {
        log.success('Data received by the callback handler')
        res.send(JSON.stringify(userdata));       
    } else {  
        log.error('Something went wrong!')
    }
})


//Express crap
app.use('/oauth2',router)
app.listen(process.env.PORT || 80);
log.warn('Raw creds, make sure to not expose them!')
log.info(`Listening on ${String(process.env.PORT || 80)}`);
log.success(`URIs to start OAuth2 flows:
Discord: ${discordtestconfig.redirect_uri}/authorize`)

```

## Contribution (get involved)

We love building a healthy community, and sadly 1 person with barely any spare time probably can't do this alone.

Feel free to get involved and help us grow the project!

To help with reading and understanding commits and code we use:

- [GitMoji](https://gitmoji.dev/)
- [Sentry](https://sentry.io)

## Analytics

big-oauth2 uses [Sentry.io](https://sentry.io) to help improve the project.

No personal information or requests should be sent to sentry, and anything that could possibly be identifiable is configured to be sanitised (like personal information, names, keys and request/response data).
On the release of 1.0.0 expect this to be changed to opt-in and only automatically enabled when passing the BIGOAUTH_DEBUG environment variable.

If you wish to opt-out of this please add the following environment variable to your startup: NO_SENTRY=true

This will skip the sentry configuration stage.