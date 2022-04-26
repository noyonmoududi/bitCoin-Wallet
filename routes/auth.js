require('../system/loader');
const express = require('express');
const route = express.Router();

const auth = loadMiddleware('auth');
/*
 @write your routes blow:
*/
exports.prefix = '/';
//route.all('*', lang);//lang in route

//users
route.get('/login', controller('user/login'));
route.get('/logout', controller('user/logout'));
route.post('/login', controller('user/attemptLogin'));
route.get('/register', controller('user/register'));
route.post('/register', controller('user/registerSubmit'));
route.get('/forget-pasword-reset', controller('user/resetPassword'));
route.post('/forget-pasword-reset', controller('user/resetPasswordSubmit'));
route.get('/update-password', auth, controller('user/updatePassword'));
route.post('/update-password', auth, controller('user/updatePasswordSubmit'));

/*
 @//finished your all routes here
*/
exports.routes = route;


