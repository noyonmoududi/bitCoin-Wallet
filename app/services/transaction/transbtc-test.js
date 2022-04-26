const axios = require('axios');
const cryptoConfig = require('./../../../config/cryptoConfig');
const FEE = cryptoConfig.btcTransactionFee;

function getUtxos (address){
    return new Promise((resolve,reject)=>{
        let insight_url = 'https://api.blockcypher.com/v1/btc/test3/addrs/'+address+'?unspentOnly=true&includeScript=true';
        axios.get(insight_url).then(res=> {
			let data = res.data;
                let utxos = data.txrefs;
                let utxosM = [];
                for (let row in utxos) {
                    if(utxos[row].confirmations>0){
                        utxosM.push({
                            txid: utxos[row].tx_hash,
                            outputIndex: utxos[row].tx_output_n,
                            script: utxos[row].script,
                            satoshis: utxos[row].value
                        })
                    }
                }
                return resolve(utxosM);
        }).catch(err=>{
            return reject({
                error:1,
                error_code:540,
                message:'UTXOS not found while sending btc!'
            });
		})
    })
}

const send = (fromAddress,pKey,outputs) => {
    return new Promise((resolve,reject)=>{
        let bitcore = require('bitcore-lib');
        getUtxos(fromAddress).then(function(utxos) {
            if(utxos.length==0){
                resolve({
                    'error' : 1,
                    'error_code' : 540,
                     success:false,
                    'message' : "You do not have enough satoshis available to send this transaction."
                });
                return;
            }

            let total_send_amount = 0;
            for(let key in outputs){
                total_send_amount = total_send_amount + outputs[key].amountInShatoshi;
            }

            let using_utxos = [];
            let balance = 0;

            for(let key in utxos){
                using_utxos.push(utxos[key]);
                balance = balance + utxos[key].satoshis;
                if(balance+FEE >= total_send_amount) break;
            }
            if(balance+FEE < total_send_amount){
                resolve({
                    'error' : 1,
                    success:false,
                    'error_code' : 540,
                    'message' : "You have insufficient satoshis."
                });
                return;
            }

            let tx = bitcore.Transaction();
            tx.from(using_utxos);
            for(let key in outputs){
                tx.to(outputs[key].address, parseInt(outputs[key].amountInShatoshi));
            }
            tx.change(fromAddress);
            tx.fee(FEE);
            tx.sign(pKey);
            tx.serialize
            let hex = tx.toString();

            axios.post('https://api.blockcypher.com/v1/btc/test3/txs/push', JSON.stringify({tx:hex})).then(res=>{
                // console.log(res.data)
                axios.post('https://blockstream.info/testnet/api/tx',hex).then(res=>{
                    let tx_id = res.data;
                }).catch(err=>{
                    //console.log(err)
                });

                return resolve({
                    success:true,
                    'error': 0,
                    'message': 'BTC has transferred successfully',
                    'txId': res.data.tx.hash,
                    'fee':FEE*0.00000001
                })
            }).catch(err=>{
                if(err.response?.data?.error) message = err.response.data.error;
                let message = "Broadcasting Failure at sending BTC";
                console.log(err)
                return reject({
                    'error' : 1,
                    success:false,
                    'error_code' : 540,
                    'message' : message
                });
            })

            

        }).catch(err=>{
            return reject(err);
        })
    })
}

exports.send = send;