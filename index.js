/**
 * Entry point for big-oauth2
 */

// Load console logging library
const log = require('./lib/logging-debug');


//Monitoring with sentry.io
log.info('Loading sentry for error and performance management for development');
if (!process.env.NO_SENTRY) {//Check if user opted out
    const Sentry = require("@sentry/node");//Require sentry
    // or use es6 import statements
    // import * as Sentry from '@sentry/node';
    
    const Tracing = require("@sentry/tracing");//Require performance tracing
    // or use es6 import statements
    // import * as Tracing from '@sentry/tracing';
    Sentry.init({
        dsn: "https://754e60bc395e4eed9d141a681be2e986@o269605.ingest.sentry.io/5588152",//public dsn
        Integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
        ],
        environment: 'git',

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0,//Default performance tracing sample rate
    });
}

// Provider loader
log.info('Loading OAuth2 provider modules');
try {
    const requireDir = require('require-dir');//Module to make my life easier
    var providers = requireDir('./providers');//Load all the providers
    if (process.env.BIGOAUTH2_DEBUG) log.info('Providers were loaded')
} catch (e) {
    log.error('Failed to load OAuth2 modules')//Error that providers failed to load
    throw "Failed to load installed providers\n"+e//Throw error
}

if (process.env.BIGOAUTH2_TESTLOAD)
    process.exit(0);

module.exports = providers;