# big-oauth2

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
const OAuth2 = require('big-oauth2');
const express = require('express');
const createError = require("http-errors");

const discordFlowHandler = new OAuth2.Discord({
    clientSecret: ...,
    clientId: ...,
    redirectUri: ...+'/oauth2/discord/callback'
});

var oauth2Router = express.Router();
router.get('/', function(req, res, next) {
    next(createError(400))
}

router.get('/discord/authorize', function(req, res, next) {
    try {
        discordFlowHandler.startFlow().then(res.redirect)
    } catch (e) {
        next(createError(500))
    }
}

router.get('/discord/callback', function(req, res, next) {
    try {
        discordFlowHandler.endFlow().then(console.log) //Logs the users data to the console
    } catch (e) {
        next(createError(500))
    }
}

var app = express();
app.use("/OAuth2", oauth2Router);
app.listen(8080);
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