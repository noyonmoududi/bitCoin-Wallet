let $this;
const path = require('path');
const cryptoConfig = require('./../../config/cryptoConfig');
const network = cryptoConfig.cryptoNetwork;
class cryptoTransaction {
    constructor(){
        $this= this;
    }

    /*
    * fromAddress: string,'
    * pkey:string,
    * to: array of object (example = [{toAddress:address,sendAmountInSatoshi:123,fee:1}])
    */

    async send(currency,fromAddress,pKey,to,fee=0){
        try{
            if(currency=='BTC'){
                let btc = require('./transaction/transbtc.js');
                let res = await btc.send(fromAddress,pKey,to,network,fee);
                return Promise.resolve(res);
            }
            else if(currency=='ETH'){
                let btc = require('./transaction/transeth.js');
                let res = await btc.send(fromAddress,pKey,to,network,fee);
                return Promise.resolve(res);
            }
            else if(currency=='MIKS'){
                let sendTo = to[0];
                let {Token} = require('./Token');
                let token = new Token('MIKS');
                let res = await token.transfer(fromAddress,pKey,sendTo.address,sendTo.amount)
                return Promise.resolve(res);
            }
            else{
                return Promise.reject({
                    'error_code' : 545,
                    'message': 'Currency not configured for transferring'
                })
            }
        }
        catch(e){
            let message = e.message || `${e}`
            return Promise.reject({
                'error_code' : 545,message
            })
        }
    }
}

module.exports = cryptoTransaction;