# big-oauth2

A Node.js module for OAuth2 to easily allow you to integrate your applications authentication with 3rd party IdPs. Returns user data with minimal code to help you create and manage users in your databases!

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
        flowHandler.Discord.startFlow().then(res.redirect)
    } catch (e) {
        next(createError(500))
    }
}

router.get('/discord/callback', function(req, res, next) {
    try {
        flowHandler.Discord.endFlow().then(console.log) //Logs the users data
    } catch (e) {
        next(createError(500))
    }
}

var app = express();
app.use("/OAuth2", oauth2Router);
app.listen(8080);
```
