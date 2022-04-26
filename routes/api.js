const express = require('express');
require('../system/loader');
const route = express.Router();
const auth = loadMiddleware('auth');

/*
 @write your routes blow:
 using role: route.method('route path',controller(folder(if any)/controllerName/method))
 NB: no need folder if no folder added into controllers folder.
 NB: write controllerName without Controller and .js. 
*/
exports.prefix = 'api/v1/';
/*
 //@finished all routes here
*/
exports.routes = route;
