const bitcoin = require("bitcoinjs-lib");
const axios = require("axios");
const validator = require("wallet-address-validator");
const Wallet = require('../addrs/btc');
const BITCOIN_DIGITS = 8;
const BITCOIN_SAT_MULT = Math.pow(10, BITCOIN_DIGITS);
const BITCOIN_FEE = 9000;

function getInputs(utxos) {
    return new Promise(async (resolve,reject) => {
        let inputs = [];
        for(let k=0;k<utxos.length;k++){
            let utxo = utxos[k];
            if (utxo.confirmations >= 1) {
                try{
                    let urlTxes = await axios.get("https://blockchain.info/rawtx/" + utxo.tx_hash_big_endian + "?cors=true&format=hex");
                    urlTxes = urlTxes.data
                    inputs.push({
                        hash: utxo.tx_hash_big_endian,
                        index: utxo.tx_output_n,
                        nonWitnessUtxo: Buffer.from(urlTxes, 'hex')
                    });
                }catch(err){
                    console.log(err)
                    reject(err)
                }
            }
        }
        if(inputs.length>0) resolve(inputs)
        else return reject({
            'error' : 1,
            'error_code' : 540,
            'message' : "Minimum Confirmed UTXOS NOT FOUND.Please again later"
        });
    
    })
}
exports.send = (fromPublicKey,privateKey, outputs,fee=0) => {
    return new Promise((resolve, reject) => {
        let amtSatoshi = 0;
        let outputsShatoshi = [];

        if(!validator.validate(fromPublicKey,'BTC')){
            return reject({
                'error' : 1,
                'error_code' : 550,
                'message' : "Invalid address "+fromPublicKey
            });
        }
        for(let i=0;i<outputs.length;i++){
            let output = outputs[i];
            if(!validator.validate(output.address,'BTC')){
                return reject({
                    'error' : 1,
                    'error_code' : 550,
                    'message' : "Invalid BTC address "+output.address
                });
            }

            // let sendAmountSatoshi = Math.floor(output.amount * BITCOIN_SAT_MULT);
            let sendAmountSatoshi = output.amountInShatoshi;
            amtSatoshi = amtSatoshi+sendAmountSatoshi;
            outputsShatoshi.push({address:output.address,value:sendAmountSatoshi});
        }
        let bitcoinNetwork = bitcoin.networks.bitcoin;
        axios.get("https://blockchain.info/unspent?cors=true&active=" + fromPublicKey).then(async resp => {
            try {
                const utxos = resp.data.unspent_outputs
                
                // const key = bitcoin.ECPair.fromWIF(privateKey)
                let key;
                try{
                    var wallet = await Wallet.getWallet(privateKey);
                    if(wallet.public!=fromPublicKey){
                        throw "Invalid private key of bitcoin address";
                    }
                    key = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'))
                }catch(err){
                    return reject({
                        'error' : 1,
                        'error_code' : 550,
                        'message' : "Invalid private key of bitcoin address "+fromPublicKey
                    });
                }

                let tx = new bitcoin.Psbt(bitcoinNetwork);
                let availableSat = 0;
                utxos.forEach(input => {
                    availableSat += input.value;
                })

                let FEE= BITCOIN_FEE;
                if(fee>0) FEE=fee;


                if ((availableSat < amtSatoshi + FEE) || amtSatoshi<0) {
                    reject({
                        'error' : 1,
                        'error_code' : 540,
                        'message' : "You do not have enough satoshis available to send this transaction."
                    });
                    return;
                }
                let tx_inputs = await getInputs(utxos);
                tx_inputs.forEach(input => {
                    tx.addInput(input)
                });
                outputsShatoshi.forEach(output=>{
                    tx.addOutput(output)
                })
                
                if((availableSat - amtSatoshi - FEE)>0){
                    tx.addOutput({
                        address: fromPublicKey,
                        value: availableSat - (amtSatoshi + FEE)
                    });
                }
                
                for (let i = 0; i < tx_inputs.length; i++) {
                    tx.signInput(i, key)
                }

                tx.validateSignaturesOfInput(0)
                
                tx.finalizeAllInputs()

                axios.post('https://api.blockcypher.com/v1/btc/main/txs/push', {tx: tx.extractTransaction().toHex() }).then(resp => {
                    return resolve({
                        'success':true,
                        'error': 0,
                        'message': 'BTC has transferred successfully',
                        'txId': resp.data.tx.hash,
                        'fee':FEE/BITCOIN_SAT_MULT
                    })
                }).catch(err => {
                    return reject({
                        'error' : 1,
                        'error_code' : 540,
                        'message' : "Broadcasting Failure at sending BTC"
                    });
                    
                })
            } catch (err) {
                if(err.error){
                    return reject(err);
                }else{
                    console.log(err);
                    return reject({
                        'error' : 1,
                        'error_code' : 540,
                        'message' : "Something went wrong with your input."
                    });
                }
                
            }
        }).catch(err => {
            return reject({
                'error' : 1,
                'error_code' : 540,
                'message' : "Something went wrong to find UTXO BTC."
            });
        });
    })

}