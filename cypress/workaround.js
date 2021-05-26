import './support/index';

// TODO: Cypress.on('window:before:unload') maybe better than this approach
window.__EurekaManagers__ = require('@eureka/ui-managers');
