const request = require('request');
// const Insight  = require('bitcore-insight').Insight;
const fee_per_byte =6;
const axios = require('axios');

// internal include
const Base = require('./BaseCryptoTransaction');
const cryptoConfig = loadConfig('cryptoConfig');
const network = cryptoConfig.cryptoNetwork;
let _this=null;
class BTC extends Base{
    constructor(){
        super();
        _this = this;
    }
    getUtxos (address){
        return new Promise((resolve,reject)=>{
            let insight_url = '';
            if(network=='testnet'){
                 console.log('testnet-getutxo method');
                 insight_url = 'https://testnet-api.smartbit.com.au/v1/blockchain/address/'+address+'/unspent';
            }
            else{
                console.log('mainnet-getutxo method');
                insight_url = 'https://api.smartbit.com.au/v1/blockchain/address/'+address+'/unspent';
            }
            request(insight_url,(err,resp,body)=> {
                if (err) {
                    response.error = 1;
                    response.error_code = 540;
                    response.message = 'UTXOS not found while sending btc!';
                    return reject(response);
                } else {
                    let data = JSON.parse(body);
                    let utxos = data.unspent;
                    let utxosM = [];
                    for (let row in utxos) {
                        utxosM.push({
                            txid: utxos[row].txid,
                            outputIndex: utxos[row].n,
                            script: utxos[row].script_pub_key['hex'],
                            satoshis: utxos[row].value_int,
                            address: utxos[row].addresses[0]
                        })
                    }
                    return resolve(utxosM);
                }
            })
        })
    }
    broadcast(hex){
        return new Promise((resolve,reject)=>{
            let txPushUrl = '';
                if(network=='testnet'){
                    txPushUrl = 'https://testnet-api.smartbit.com.au/v1/blockchain/pushtx';
                }
                else{
                    txPushUrl = 'https://api.smartbit.com.au/v1/blockchain/pushtx';
                }
                let sendData = {"hex": hex.toString()};
                axios.post(txPushUrl,sendData).then(resp => {
                    let data = resp.data;
                    response.error = 0;
                    response.message = 'Successfully has transferred BTC';
                    response.txId = data.txid;
                    return resolve(response);
                }).catch(err=>{
                    response.error = 1;
                    response.error_code = 540;
                    response.message = 'BTC broadcasting Failure';
                    return reject(err);
                });
        });
    }
    send(fromAddress,pKey,to,withFee=0){
        return new Promise((resolve,reject)=>{
            // Fee is in satoshis
            const fee = cryptoConfig.btcTransactionFee; 
            
            _this.getUtxos(fromAddress).then(function(utxos) {
                let balanceAvailable  = _this.getBalanceFromUtxos(utxos);
                if(Number(balanceAvailable) - Number(fee) <to.sendAmountInSatoshi){
                    return resolve({
                       success:false,
                       balance:balanceAvailable,
                       totalAmount:to.sendAmountInSatoshi
                    });
                }
                let bitcore = require('bitcore-lib');
                let tx = bitcore.Transaction();
                tx.from(utxos);
                if(to.fee && withFee==1){
                    tx.to(to.toAddress, Math.floor(to.sendAmountInSatoshi)); // In Satoshis (btc/0.00000001)
                }else{
                    tx.to(to.toAddress, Math.floor(to.sendAmountInSatoshi)); // In Satoshis (btc/0.00000001)
                }
                tx.change(fromAddress);
                tx.fee(fee);
                tx.sign(pKey);
                tx.serialize();
                _this.broadcast(tx).then(success=>{
                    success.success=true;
                    success.fee = fee*0.00000001;
                    return resolve(success);
                }).catch(fail=>{
                    return reject(fail);
                })
            }).catch(err=>{
                console.log(err);
                return reject(err);
            })
        })
    }
    getBalanceFromUtxos(utxos){
        let isArr = Array.isArray(utxos);
        if(!isArr){
            return 0;
        }
        if(!utxos.length){
            return 0;
        }
        let total = 0;
        utxos.forEach((item,index)=>{
            total = total + item.satoshis
        });
        return total;
    }    
}
module.exports = BTC;