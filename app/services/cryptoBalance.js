const  request = require('request');
const cryptoConfig = loadConfig('cryptoConfig');
let web3 = require('web3');
const axios = require('axios');
const network = cryptoConfig.cryptoNetwork;


let error = {
    'error_code' : 545,
    'message': ''
};

function getBalanceErrorResponse(err='Something went wrong to get balance!',error_code = 545){
   error = {
       'error_code' : error_code,
       'message': err
   };
   return error;
}

module.exports = class cryptoBalance{
    getBalance (currency,address){
        return new Promise((resolve,reject)=>{
            switch (currency){
                case 'ETH':
                    let web3 = require('web3');
                    let apiUrl='';
                    if(network == 'testnet'){
                        apiUrl='https://kovan.infura.io/v3/15851454d7644cff846b1b8701403647';
                    }else{
                        apiUrl= 'https://mainnet.infura.io/v3/15851454d7644cff846b1b8701403647';
                    }
                    web3 = new web3(new web3.providers.HttpProvider(apiUrl));
                    web3.eth.getBalance(address,(err,balance)=>{
                        if(err){
                            return reject(err);
                        }
                        let ethBalance = {
                            balance: parseFloat(balance),
                            unconfirmedBalance: 0,
                            total: parseFloat(balance),
                            currency:currency,
                            address:address
                        };
                        return resolve(ethBalance);
                    });
                    break;

                case 'BTC':
                    let btc_url = '';
                    if(cryptoConfig.cryptoNetwork == 'testnet'){
                        btc_url='https://blockstream.info/testnet/api/address/'+address+'/utxo';;
                    }
                    else{
                        //btc_url = 'https://api.blockcypher.com/v1/btc/main/addrs/'+address+'?unspentOnly=true&includeScript=true';
                        btc_url='https://blockstream.info/api/address/'+address+'/utxo';
                    }

                        let btcToSatoshi= 100000000;
                        axios.get(btc_url).then(res=> {
                            let data = res.data;
                            let confirmBalance = 0;
                            let unconfirmBalace=0;
                            for (let row in data) {
                                if(data[row].status.confirmed) confirmBalance  = Number(confirmBalance) + Number(data[row].value);
                                else  unconfirmBalace  = Number(unconfirmBalace) + Number(data[row].value);
                            }
                            return resolve({
                                total:(unconfirmBalace+confirmBalance)/btcToSatoshi,
                                unconfirmedBalance:unconfirmBalace/btcToSatoshi,
                                balance:confirmBalance/btcToSatoshi,
                                currency:currency,
                                address:address
                            })
                        }).catch(err=>{
                            console.log(err);
                            return reject({
                                error:1,
                                error_code:540,
                                message:'something went wrong to blockchain api!'
                            });
                        });
                    break;
                case 'MIKS':
                case 'EBITEMPURA':
                    let {Token} = require('./Token');
                    let token = new Token(currency);
                    token.getBalance(address).then(balance=>{
                        resolve({
                            balance: parseFloat(balance),
                            unconfirmedBalance: 0,
                            total: parseFloat(balance),
                            currency:currency,
                            address:address
                        })
                    }).catch(err=>{
                        console.log(err);
                        return reject({
                            error:1,
                            error_code:540,
                            message:'something went wrong to blockchain api!'
                        });
                    })
                    break;
                default:
                    error.error_code = 545;
                    error.message='Invalid currency '+currency;
                    return reject(error);
            }
        });
    }
}




