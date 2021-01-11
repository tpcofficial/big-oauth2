/**
 * Entry point for big-oauth2
 */

// Load console logging library
const log = require('./lib/logging-debug');

log.info('Loading sentry for error and performance management for development');
if (!process.env.NO_SENTRY) {
    const Sentry = require("@sentry/node");
    // or use es6 import statements
    // import * as Sentry from '@sentry/node';
    
    const Tracing = require("@sentry/tracing");
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
        tracesSampleRate: 1.0,
    });
}

// Provider loader
log.info('Loading OAuth2 provider modules');
try {
    const requireDir = require('require-dir');
    var providers = requireDir('./providers');
} catch (e) {
    log.error('Failed to load OAuth2 modules')
}

module.exports = providers;