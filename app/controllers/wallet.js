const Controller = require('./Controller');
const UserAddressModel = loadModel('UserAddressModel');
const currencyModel = loadModel('currency');
const cryptowallet = loadService('cryptowallet');
const cryptoConfig = loadConfig('cryptoConfig');
const allowedCurrencies = cryptoConfig.allowedCurrencies;
const serviceModel = loadService('cryptoBalance');
let cryptoBalance = new serviceModel();
let walletService = new cryptowallet();
const encryption = loadLibrary('encryption');
const cryptoTransaction = loadService('cryptoTransaction');
let tx = new cryptoTransaction();

module.exports = class WalletController extends Controller {
    constructor() {
        super();
    }

    async index(req, res, next) {
        try {
            let data = {
                Request : req,
            }
            const {user} = req.session;
            const {id} = user;
            let currencies = await currencyModel.getAllData();
            let wallets = {};
            if (currencies.length > 0) {
                currencies = currencies.filter((currency, index) => allowedCurrencies.includes(currency.symbol));
            }
            currencies.forEach((currency,index)=>{
                let walletCurrency= currency.symbol;
                wallets[walletCurrency] = [];
            });
            let userWallets = await UserAddressModel.findByWallets(id);
            if (userWallets.length >0) {
                for(let key in userWallets){
                    try{
                        let balance = await cryptoBalance.getBalance(userWallets[key].currency, userWallets[key].address);
                        wallets[userWallets[key].currency].push({
                            id:userWallets[key].id,
                            currency:userWallets[key].currency,
                            address:userWallets[key].address,
                            balance : balance.balance,
                            unconfirmedBalance : balance.unconfirmedBalance
                        })
                    }catch(e){
                        wallets[userWallets[key].currency].push({
                            id:userWallets[key].id,
                            currency:userWallets[key].currency,
                            address:userWallets[key].address,
                            balance : 0,
                            unconfirmedBalance : 0
                        })
                    }
                }
            } 
            data.wallets=wallets,
            data.currencies=currencies
            return res.render('pages/wallet/index', data);
            
        } catch (error) {
            return next(error);
        }
    }

    async createWallet(req, res, next) {
        try {
            let data = {
                Request : req,
                currencieData :[]
            }
            let currencies = await currencyModel.getAllData();
            if (currencies != null) {
                data.currencieData= currencies;
            }
            return res.render('pages/wallet/create', data);
        } catch (error) {
            return next(error);
        }
        
    }
    async walletSave(req, res, next) {
        try {
            let currency = req.body.currency;
            if (!currency || currency.length<3) {
                req.session.flash_fail = 'fail..'+('wallet not supported');
                return res.redirect('/wallet');
            }
            let wallet = await walletService.getWallet(currency);
            if (wallet == null) {
                req.session.flash_fail = 'fail..'+  currency + ' ' + ' wallet not supported'
                return res.redirect('/wallet');
            }
            let userWallets = await UserAddressModel.findAddress(req.session.user.id,currency);
            if (userWallets.length >= 4) {
                req.session.flash_fail = 'fail..' + currency + ' ' + ' wallet all ready exists for you';
                return res.redirect('/wallet');
            }
            let saveData = await UserAddressModel.save({
                user_id: req.session.user.id,
                currency,
                address: wallet.public,
                pk: encryption.encrypt(wallet.private)
            });
            req.session.flash_success =  `${currency} wallet created successful`;
            return res.redirect('/wallet');
        } catch (error) {
            return next(error);
        } 
    }

    async depositOrWithDraw(req, res, next) {
        try {
            let data = {
                Request : req,
            }
            let {id:walletId} =req.params;
            let userId = req.session.user.id;
            let wallet = await UserAddressModel.findOneByWalletAndUser(walletId,userId);
            if(!wallet){
                return next(req.app.get('createError')(404));
            }
            let walletCurrency = wallet.currency.toUpperCase();
           
            let getBalanceFromCryptoNetwork = await cryptoBalance.getBalance(walletCurrency, wallet.address);
            wallet = getBalanceFromCryptoNetwork;
            wallet.currencySymbol = walletCurrency;
            data.wallet=wallet;
            return res.render('pages/wallet/withdraw', data);
        } catch (error) {
            return next(error);
        }
        
    }

    async withdraw(req, res, next) {
        try {

            let user = req.session.user;
            let {currency, available_balance, to_address, send_amount} = req.body;
            let fromAddress = req.params.address;

            currency = currency.toUpperCase();
            let wallet = await UserAddressModel.getUserAddress(user.id,currency,fromAddress);
            let toAddressSend = [];
            // 1 btc = 100000000 satoshi;
            const btcToSatoshi = 100000000;
            switch (currency) {
                case 'BTC':
                    toAddressSend = [{
                        address: to_address,
                        amountInShatoshi: Math.floor((Number(send_amount) * btcToSatoshi)),
                    }];
                    break;
                case 'ETH':
                case 'MIKS':
                case 'EBITEMPURA':
                    toAddressSend =
                        [{
                            address: to_address,
                            amount: send_amount,
                        }]
                    ;
                    break;
                default:
                    req.flash('fail', `${currency} is not supported !`);
                    return res.redirect('/wallet');
            }

            let transactionResponse = await tx.send(currency, wallet.address, encryption.decrypt(wallet.pk), toAddressSend);
            if(!transactionResponse.success){
                req.session.flash_fail=`Fail!..${transactionResponse.message}`;
                return res.redirect('/wallet');
            }
            req.session.flash_success= `Success. ${transactionResponse.message}.TXID:-  ${transactionResponse.txId}`;
            return res.redirect('/wallet');
        } catch (err) {
            console.log(err);
            req.session.flash_fail= `Fail!..${err.message}`;
            return res.redirect('/wallet');
        }
    }
}