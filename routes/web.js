require('../system/loader');
const express = require('express');
const route = express.Router();

const auth = loadMiddleware('auth');
/*
 @write your routes blow:
*/
exports.prefix = '/';
//route.all('*', lang);//lang in route

route.get('/',controller('home/index'));

//dashboard
route.get('/dashboard',auth,controller('home/dashboard'));

<<<<<<< HEAD
//Wallet 

route.get("/wallet",auth,controller("wallet/index"));
route.get("/createWallet",auth,controller("wallet/createWallet"));
route.post("/createWallet",auth,controller("wallet/walletSave"));
route.get("/deposit-or-withdraw/:id",auth,controller("wallet/depositOrWithDraw"));
route.post("/withdraw/:address",auth,controller("wallet/withdraw"));

=======
>>>>>>> cd99976a3ab1ed00e8f8d54f5996315e8b4fb44c
/*
 @//finished your all routes here
*/
exports.routes = route;


