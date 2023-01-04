
const axios = require('axios')
const validator = require("wallet-address-validator");

let FEE_PER_BYTE = 30; //in satoshi

function getUtxos(address,network='mainnet'){
    return new Promise((resolve,reject)=>{
        let res_utxos = []
        if(network == 'testnet'){
            // let insight_url =; 'https://api.blockcypher.com/v1/btc/test3/addrs/'+address+'?unspentOnly=true&includeScript=true';
            let insight_url = 'https://blockstream.info/testnet/api/address/'+address+'/utxo';
            axios.get(insight_url).then(res=> {
                let data = res.data;
                    // let utxos = data.txrefs;~
                    let utxos = data;
                    for (let row in utxos) {
                        if(utxos[row].status.confirmed){
                            res_utxos.push({
                                txid: utxos[row].txid,
                                index: utxos[row].vout,
                                satoshi: utxos[row].value
                            })
                        }
                    }
                    return resolve(res_utxos);
            }).catch(err=>{
                console.log(err)
                return resolve({
                    'error' : 1,
                    success:false,
                    'error_code' : 540,
                    'message' : 'UTXOS not found while sending btc!'
                });
            })

        }else{
            axios.get('https://blockchain.info/unspent?cors=true&active='+address).then(res=>{
                let utxos = res.data.unspent_outputs;
                for(let k in utxos){
                    let element = utxos[k];
                    res_utxos.push({
                        txid:element.tx_hash_big_endian,
                        index: element.tx_output_n, //index of prev output
                        satoshi:element.value
                    });
                }
                return resolve(res_utxos);
            }).catch(err=>{
                console.log(err)
                return reject({
                    'error' : 1,
                    success:false,
                    'error_code' : 540,
                    'message' : 'UTXOS not found while sending btc!'
                });
            })
        }

    })
}

function broadcast(hex,network='mainnet'){
    return new Promise((resolve,reject)=>{
        let net = (network == 'testnet') ? 'test3': 'main'
        axios.post('https://api.blockcypher.com/v1/btc/'+net+'/txs/push', JSON.stringify({tx:hex})).then(res=>{
                // console.log(res.data)
                if(network == 'testnet'){
                    axios.post('https://blockstream.info/testnet/api/tx',hex).then(res=>{
                        let tx_id = res.data;
                    }).catch(err=>{
                        console.log(err);
                    });
                }
                return resolve({
                    success:true,
                    'error': 0,
                    'message': 'BTC has transferred successfully',
                    'txId': res.data.tx.hash,
                })
            }).catch(err=>{
                //console.log(err)
                let message = "Broadcasting Failure at sending BTC";
                if(err.response?.data?.error) message = err.response.data.error;
                if(process.env.LOGS=='ON') console.log(message+' in broadcasting.')
                return resolve({
                    'error' : 1,
                    success:false,
                    'error_code' : 540,
                    'message' : message
                });
            })
    })
}

const send = (fromPublicKey,privateKey, outputs,network='mainnet',fee=0) => {
    console.log('Trying to making an transaction using ',{fromPublicKey,outputs})
    return new Promise((resolve, reject) => {
        let receivers = [];
        let total_send_amount = 0;
        for(let i=0;i<outputs.length;i++){
            let output = outputs[i];
            if(!validator.validate(output.address,'BTC',network)){
                if(process.env.LOGS=='ON') console.log("Invalid output BTC address "+output.address)
                return resolve({
                    'error' : 1,
                    'success':false,
                    'error_code' : 550,
                    'message' : "Invalid output BTC address "+output.address
                });
            }

            let sendAmountSatoshi = output.amountInShatoshi || (output.amount*100000000);
            receivers.push({address:output.address,amountInShatoshi:sendAmountSatoshi});
            total_send_amount = total_send_amount + sendAmountSatoshi;
        }

        getUtxos(fromPublicKey,network).then(utxos=>{

            if(utxos.length==0){
                if(process.env.LOGS=='ON') console.log("You do not have enough satoshis available to send this transaction.")
                resolve({
                    'error' : 1,
                    success:false,
                    'error_code' : 540,
                    'message' : "You do not have enough satoshis available to send this transaction."
                });
                return;
            }
            const TX = require('./tx-btc/transaction')
            let txobj = new TX.Transaction()

            // Adding a input.You can call this addInput method multiple times for multiple input
            for(let k in utxos){
                txobj.addInput(utxos[k]);
            }

            //If you sent satoshi to multiple addresses the total amount will be the sum of those.
            receivers.forEach(receiver=>{
                txobj.addOutput(receiver.address,receiver.amountInShatoshi)
            })

            
            txobj.signInput(privateKey);
            let FEE=0;
            if(fee==0) {
                let size_without_change = txobj.getSize();
                console.log(size_without_change)
                // console.log('size_without_change',size_without_change)
        
                let FEE_WITHOUT_CHANGE = size_without_change*FEE_PER_BYTE;
                let FEE_OF_CHANGE = 34*FEE_PER_BYTE;
                let FEE_WITH_CHANGE = FEE_WITHOUT_CHANGE + FEE_OF_CHANGE;
                FEE = FEE_WITHOUT_CHANGE;
                FEE = FEE;
        
                if(txobj.balance - total_send_amount-FEE_WITHOUT_CHANGE > 0) FEE = FEE_WITH_CHANGE;
                FEE = FEE;
            }
            else{
                FEE = fee;
            }


            let change_amount = txobj.balance - total_send_amount - FEE;

            if(change_amount<0){
                if(process.env.LOGS=='ON') console.log('Insufficient Balance: '+txobj.balance+' to send '+ total_send_amount +' +Fee('+FEE+') BTC')
                resolve({
                    success:false,
                    'error' : 1,
                    'success':false,
                    'error_code' : 540,
                    'message' : 'Insufficient Balance: '+txobj.balance+' to send '+ total_send_amount +' +Fee='+FEE+' BTC'
                });
                return;
            } 
            else if(change_amount>0){
                txobj.addChange(fromPublicKey,change_amount)
                txobj.signInput(privateKey);
            }

            let hex = txobj.toHex() // Need to publish this transaction hex
            broadcast(hex,network).then(async res=>{
                if(res.error==1 && !res.success){
                    console.log('BTC trying to 2nd option(witness) for transaction..')
                    let newtx;
                    if(network=='mainnet') newtx = require('./transbtc-wit-main');
                    else newtx = require('./transbtc-wit-test');
                    try{
                        let txres2 = await newtx.send(fromPublicKey,privateKey, outputs,FEE);
                        console.log('BTC transaction is successfully done by 2nd option(witness)')
                        return resolve(txres2)
                    }catch(err){
                        console.log(err)
                        resolve({...res,fee:FEE*0.00000001})
                    }
                }
                else resolve({...res,fee:FEE*0.00000001})
            }).catch(err=>{
                console.log(err)
                
            })

        }).catch(err=>{
            console.log(err)
        })
    })

}

const sendRnd = async(fromPublicKey,privateKey, outputs,network='mainnet',fee=0) => {
    console.log('Trying to making an transaction using ',{fromPublicKey,outputs})
    return new Promise(async(resolve, reject) => {
        let receivers = [];
        let total_send_amount = 0;
        for(let i=0;i<outputs.length;i++){
            let output = outputs[i];
            if(!validator.validate(output.address,'BTC',network)){
                if(process.env.LOGS=='ON') console.log("Invalid output BTC address "+output.address)
                return resolve({
                    'error' : 1,
                    'success':false,
                    'error_code' : 550,
                    'message' : "Invalid output BTC address "+output.address
                });
            }

            let sendAmountSatoshi = output.amountInShatoshi || (output.amount*100000000);
            receivers.push({address:output.address,amountInShatoshi:sendAmountSatoshi});
            total_send_amount = total_send_amount + sendAmountSatoshi;
        }
        const TX = require('./tx-btc/transaction')
        let txobj = new TX.Transaction();

        for (let i = 0; i < fromPublicKey.length; i++) {
            const element = fromPublicKey[i];
            
            let utxos = await getUtxos(element.fromAddress,network);

         if(utxos.length==0){
            if(process.env.LOGS=='ON') console.log("You do not have enough satoshis available to send this transaction.")
            resolve({
                'error' : 1,
                success:false,
                'error_code' : 540,
                'message' : "You do not have enough satoshis available to send this transaction."
            });
            return;
        }


        // Adding a input.You can call this addInput method multiple times for multiple input
        for(let k in utxos){
            txobj.addInput(utxos[k]);
        }

        //If you sent satoshi to multiple addresses the total amount will be the sum of those.
        receivers.forEach(receiver=>{
            txobj.addOutput(receiver.address,receiver.amountInShatoshi)
        })

        
        txobj.signInput(privateKey[i].pk);
        let FEE=0;
        if(fee==0) {
            let size_without_change = txobj.getSize();
            console.log(size_without_change)
            // console.log('size_without_change',size_without_change)
    
            let FEE_WITHOUT_CHANGE = size_without_change*FEE_PER_BYTE;
            let FEE_OF_CHANGE = 34*FEE_PER_BYTE;
            let FEE_WITH_CHANGE = FEE_WITHOUT_CHANGE + FEE_OF_CHANGE;
            FEE = FEE_WITHOUT_CHANGE;
            FEE = FEE;
    
            if(txobj.balance - total_send_amount-FEE_WITHOUT_CHANGE > 0) FEE = FEE_WITH_CHANGE;
            FEE = FEE;
        }
        else{
            FEE = fee;
        }


        let change_amount = txobj.balance - total_send_amount - FEE;

        if(change_amount<0){
            if(process.env.LOGS=='ON') console.log('Insufficient Balance: '+txobj.balance+' to send '+ total_send_amount +' +Fee('+FEE+') BTC')
            resolve({
                success:false,
                'error' : 1,
                'success':false,
                'error_code' : 540,
                'message' : 'Insufficient Balance: '+txobj.balance+' to send '+ total_send_amount +' +Fee='+FEE+' BTC'
            });
            return;
        } 
        else if(change_amount>0){
            txobj.addChange(element.fromAddress,change_amount)
            txobj.signInput(privateKey[i].pk);
        }

        }
        
        let hex = txobj.toHex() // Need to publish this transaction hex
        console.log(hex);
        broadcast(hex,network).then(async res=>{
            if(res.error==1 && !res.success){
                console.log('BTC trying to 2nd option(witness) for transaction..')
                let newtx;
                if(network=='mainnet') newtx = require('./transbtc-wit-main');
                else newtx = require('./transbtc-wit-test');
                try{
                    let txres2 = await newtx.send(fromPublicKey,privateKey, outputs,FEE);
                    console.log('BTC transaction is successfully done by 2nd option(witness)')
                    return resolve(txres2)
                }catch(err){
                    console.log(err)
                    resolve({...res,fee:FEE*0.00000001})
                }
            }
            else resolve({...res,fee:FEE*0.00000001})
        }).catch(err=>{
            console.log(err)
            
        })
    })

}


exports.send = send;
exports.sendRnd = sendRnd;