/**
 * Entry point for big-oauth2
 */

// Load console logging library
const log = require('./lib/logging-debug');


// Provider loader
log.info('Loading OAuth2 provider modules');
try {
    const requireDir = require('require-dir');
    var providers = requireDir('./providers');
} catch (e) {
    log.error('Failed to load OAuth2 modules')
}

module.exports = providers;