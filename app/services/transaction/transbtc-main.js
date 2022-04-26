const { Transaction } = require('./tx-btc/transaction')
const axios = require('axios')
const validator = require("wallet-address-validator");

let FEE_PER_BYTE = 10; //in satoshi

const BITCOIN_DIGITS = 8;
const BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);

exports.send = (fromPublicKey,privateKey, outputs) => {
    return new Promise((resolve, reject) => {
        let receivers = [];

        let total_send_amount = 0;
        for(let i=0;i<outputs.length;i++){
            let output = outputs[i];
            if(!validator.validate(output.address,'BTC')){
                return reject({
                    'error' : 1,
                    'error_code' : 550,
                    'message' : "Invalid BTC address "+output.address
                });
            }

            let sendAmountSatoshi = Math.floor(output.amount * BITCOIN_SAT_MULT);
            receivers.push({address:output.address,amountInShatoshi:sendAmountSatoshi});
            total_send_amount = total_send_amount + sendAmountSatoshi;
        }

        axios.get('https://blockchain.info/unspent?cors=true&active='+fromPublicKey).then(res=>{
        let utxos = res.data.unspent_outputs;
        if(utxos.length==0){
            reject({
                'error' : 1,
                'error_code' : 540,
                'message' : "You do not have enough satoshis available to send this transaction."
            });
            return;
        }

        let txobj = new Transaction()

        // Adding a input.You can call this addInput method multiple times for multiple input

        let total_input_amount = 0;
        for(let k in utxos){
            let element = utxos[k];
            txobj.addInput({
                txid:element.tx_hash_big_endian,
                index: element.tx_output_n, //index of prev output
                satoshi:element.value
            });
            total_input_amount = total_input_amount+element.value;
            if(total_send_amount<=total_input_amount){
                break;
            }
        }

        //If you sent satoshi to multiple addresses the total amount will be the sum of those.
        
        receivers.forEach(receiver=>{
            txobj.addOutput(receiver.address,receiver.amountInShatoshi)
        })

        
        txobj.signInput(privateKey);
        
        let size_without_change = txobj.getSize();
        // console.log('size_without_change',size_without_change)

        let FEE_WITHOUT_CHANGE = size_without_change*FEE_PER_BYTE;
        let FEE_OF_CHANGE = 34*FEE_PER_BYTE;
        let FEE_WITH_CHANGE = FEE_WITHOUT_CHANGE + FEE_OF_CHANGE;
        let FEE = FEE_WITHOUT_CHANGE;
        FEE = FEE;

        if(txobj.balance - total_send_amount-FEE_WITHOUT_CHANGE > 0) FEE = FEE_WITH_CHANGE;
        FEE = FEE;

        let change_amount = txobj.balance - total_send_amount - FEE;

        if(change_amount<0){
            reject({
                'error' : 1,
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

        axios.post('https://api.blockcypher.com/v1/btc/main/txs/push', JSON.stringify({tx: hex})).then(resp => {
            return resolve({
                'error': 0,
                'message': 'BTC has transferred successfully',
                'txId': resp.data.tx.hash,
                'fee':FEE/BITCOIN_SAT_MULT
            })
        }).catch(err => {
            console.log(err.response.data.error)
            let message = "Broadcasting Failure at sending BTC";
            if(err.response?.data?.error) message = err.response.data.error;
            console.log(err)
            return reject({
                'error' : 1,
                'error_code' : 540,
                'message' : message
            });
        })

        }).catch(err=>{
            console.log(err)
        })
    })

}