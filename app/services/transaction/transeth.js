let EthTx = require('ethereumjs-tx').Transaction;
const cryptoConfig = loadConfig('cryptoConfig');
const network =cryptoConfig.cryptoNetwork;


const Base = require('./BaseCryptoTransaction');

class ETH extends Base{

    send(fromAddress,pKey,to,withFee=0,incNonce=0){
        const {toAddress,sendAmount} = to;
        // console.log({toAddress,sendAmount});
        console.log({pKey})
        return new Promise((resolve,reject)=>{

            let web3 = require('web3');
            let apiUrl = '';
            if(network == 'testnet'){
                apiUrl= 'https://goerli.infura.io/v3/15851454d7644cff846b1b8701403647';
            }else{
                apiUrl='https://mainnet.infura.io/v3/15851454d7644cff846b1b8701403647';
            }
            web3 = new web3(new web3.providers.HttpProvider(apiUrl));
            if(pKey.length==66){
                pKey = pKey.substr(2, pKey.length);
            }
            let fromPkeyB =Buffer.from(pKey,'hex');
            //Get Nonce for sending amount
            web3.eth.getTransactionCount(fromAddress).then(function(nonce){
                nonce = nonce+incNonce;
                var EthAmount = parseInt(web3.utils.toWei(`${sendAmount}`));
                web3.eth.getBalance(fromAddress,(err,balance)=>{
                    if (err) {
                        response.error = 1;
                        response.error_code = 540;
                        response.message = 'Something went wrong to get balance of sender(ETH)!';
                        return reject(response);
                    }else{
                        web3.eth.getGasPrice()
                            .then((gasPrice)=>{
                                const gasLimit = 21000;
                                let fee = gasLimit*gasPrice;
                                if(withFee==1){
                                    EthAmount = EthAmount-fee;
                                }
                                response.fee = web3.utils.fromWei(`${fee}`);
                                if(parseInt(balance)<(EthAmount+fee) || balance == 0){
                                    response.error = 1;
                                    response.error_code = 540;
                                    response.message = 'Insufficient balance of sender(ETH)!';
                                    return reject(response);
                                    
                                }else{
                                    let rawTx = {
                                        nonce: `${web3.utils.toHex(nonce)}`,
                                        from:`${fromAddress}`,
                                        to: `${toAddress}`,
                                        value:`${web3.utils.toHex(EthAmount)}`,
                                        gasLimit:`${web3.utils.toHex(gasLimit)}`,
                                        gasPrice:`${web3.utils.toHex(gasPrice)}`
                                    };
                                    let tx=null;
                                    if(network=='testnet'){
                                        tx = new EthTx(rawTx,{chain:'kovan'});
                                        
                                        // rawTx.chainId = `${web3.utils.toHex(69)}`; //4=rinkeby 42=kovan
                                    }
                                    else{
                                        tx = new EthTx(rawTx,{chain:'mainnet'}); 
                                    } 
                                    tx.sign(fromPkeyB);                                    
                                    const serializeTx = `0x${tx.serialize().toString('hex')}`;
                                    web3.eth.sendSignedTransaction(serializeTx,(err,res)=>{
                                        if(err){
                                            console.log({err})
                                            console.log(err);
                                            response.error = 1;
                                            response.error_code = 540;
                                            response.message = 'Private key does not match or network error at broadcasting ETH';
                                           console.log({response})
                                            return  reject(response);
                                        }else{
                                            response.error = 0;
                                            response.message = 'ETH has transferred Successfully';
                                            response.txId = res;
                                            return resolve(response);

                                        }
                                    });
                                }
                            }); //getGasPrice
                    }
                });//getBalance for checking availability
            }).catch(err=>{
                response.error = 1;
                response.error_code = 540;
                response.message = 'Nonce not found at sending ETH!';
               return reject(response);
            });
        })
    }
}
module.exports =new ETH();