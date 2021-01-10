# big-oauth2

A Node.js module for OAuth2 to easily allow you to integrate your applications authentication with 3rd party IdPs. Returns user data with minimal code to help you create and manage users in your databases!

## Note

For purely concept, may use premade authentication libraries for the OAuth2 APIs offered by the services, we'll then work on replacing the libraries for http requests using `node-fetch`

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
