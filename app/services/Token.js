let Web3 = require('web3');
let network = process.env.CRYPTO_NETWORK;
const token_data = {
    EBITEMPURA : {
        httpProvider: 'https://bsc-dataseed1.binance.org',
        contractAddress:'0x37781b87619722e1765dd4864894931bebd1bb3c',
        currency:'BNB',
        chain:'mainnet',
        symbol:'EBITEMPURA',
        name:'EbitempuraSwap Token',
        abi:[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint256","name":"initialBalance_","type":"uint256"},{"internalType":"address payable","name":"feeReceiver_","type":"address"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"generator","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
    },
    MIKS : {
        httpProvider: 'https://mainnet.infura.io/v3/15851454d7644cff846b1b8701403647',
        contractAddress:'0xfbaf48e57cab46f4c2e03edb90a421d9fc6c7cbf',
        currency:'ETH',
        chain:'mainnet',
        symbol:'MIKS',
        name:'MIKScoin',
        abi:[{"inputs":[{"internalType":"string","name":"name_","type":"string"},{"internalType":"string","name":"symbol_","type":"string"},{"internalType":"uint256","name":"initialBalance_","type":"uint256"},{"internalType":"address payable","name":"feeReceiver_","type":"address"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"generator","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"}]
    },
    TST: {
        httpProvider: 'https://kovan.infura.io/v3/15851454d7644cff846b1b8701403647',
        contractAddress:'0x68a2e1d9324b6f2aec448db5dffd4c444a375da9',
        currency:'ETH',
        chain:'kovan',
        symbol:'TST',
        name:'Test Token',
        abi:[{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x095ea7b3"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"total_Supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x23b872dd"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"decimal","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x313ce567"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x42966c68"},{"constant":false,"inputs":[],"name":"freeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x62a5af3b"},{"constant":false,"inputs":[],"name":"unfreeze","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x6a28f000"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x8da5cb5b"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x95d89b41"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"changeOwner","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa6f9dae1"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":true,"inputs":[],"name":"isFreeze","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xc154d6ca"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xdd62ed3e"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event","signature":"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"},{"anonymous":false,"inputs":[],"name":"Freeze","type":"event","signature":"0x615acbaede366d76a8b8cb2a9ada6a71495f0786513d71aa97aaf0c3910b78de"},{"anonymous":false,"inputs":[],"name":"Unfreeze","type":"event","signature":"0x2f05ba71d0df11bf5fa562a6569d70c4f80da84284badbe015ce1456063d0ded"}]
    }
}

exports.Token = class Token {

    constructor(token_symbol){
        if(!token_symbol) throw 'Please provide EBITEMPURA/MIKS';
        if(network=='testnet') token_symbol = 'TST'
        this.contractAddress = token_data[token_symbol].contractAddress;
        this.network = 'mainnet';
        this.currency =  token_data[token_symbol].currency;
        this.abi = token_data[token_symbol].abi;
        this.chain = token_data[token_symbol].chain
        this.web3 = new Web3(new Web3.providers.HttpProvider(token_data[token_symbol].httpProvider));
        this.contract = new this.web3.eth.Contract(this.abi,this.contractAddress);
        this.gasLimit = 100000;
        this.customGasPrice = 0;
        this.decimals = 18;
        this.symbol = token_symbol;
        this.name = token_data[token_symbol].name;
    }
    createWallet(private_key=''){
        let Accounts = require('web3-eth-accounts');
        let accounts = new Accounts();
        let wallet;
        if(private_key == '') wallet = accounts.create();
        else wallet = accounts.privateKeyToAccount(private_key);
        return {
            'public':wallet.address,
            'private':wallet.privateKey
        };
    }

    getTotalSupply(){
        let _this = this;
        return new Promise((resolve,reject)=>{
            this.contract.methods.totalSupply().call()
                .then(function(result){
                    let total_sp = _this.fromUnit(result);
                    resolve(total_sp);
                }).catch(err=>{
                reject(err)
            });
        })
    }

    async getBalance(address){
        let _this = this;
        return new Promise((resolve,reject)=>{
            this.contract.methods.balanceOf(address).call()
                .then(function(result){
                    resolve(_this.fromUnit(result))
                }).catch(err=>{
                    reject(err)
            });
        })
    }

    getDecimals(){
        return this.decimals;
    }
    getName(){
        return this.name;
    }

    toUnit(amount){
        return this.web3.utils.toWei(`${amount}`);
    };

    fromUnit(amount){
        return this.web3.utils.fromWei(`${amount}`);
    };

    getSymbol(){
        return this.symbol;
    };

    isAddress(address){
        let format = /^0x[0-9a-fA-F]{40}$/;
        return format.test(address);
    }

    async getNonce(address){
        let _this = this;
        return new Promise((resolve,reject)=>{
            _this.web3.eth.getTransactionCount(address).then(nonce=>{
                resolve(nonce)
            }).catch(reject)
        })
    }

    async getGasPrice(){
        let _this = this;
        return new Promise((resolve,reject)=>{
            _this.web3.eth.getGasPrice().then(GasPrice=>{
                resolve(GasPrice)
            }).catch(reject)
        })
    }

    async getEthBalance(address){
        let _this = this;
        return new Promise((resolve,reject)=>{
            _this.web3.eth.getBalance(address,(err,balance)=>{
                   if(err) reject(err)
                   else resolve(balance);
            });
        })
    }


    async transfer (fromAddress,pKey,toAddress,amount,nonce=0){
        let _this = this;
        let resData = {
            error : -1,
            message : null,
            txId : null,
        }
        return new Promise(async (resolve,reject)=>{
            
            let balance = await this.getBalance(fromAddress);
            
            let symbol = await this.getSymbol();
            if(parseFloat(balance) < amount){
                resData.error = 1;
                resData.message = 'Insufficient Token balance! You have '+balance+' '+symbol;
                return reject(resData);
            }

            let Transaction = require('ethereumjs-tx').Transaction;

            if(pKey.length==66){
                pKey = pKey.substr(2, pKey.length);
            }
            let fromPkeyB = Buffer.from(pKey,'hex');
            
            if(this.isAddress(toAddress)){
                toAddress = this.web3.utils.toChecksumAddress(toAddress);
            }
            if(this.web3.utils.isAddress(toAddress)){

                let myContract = this.contract;
                let sendAmount = this.toUnit(amount);
                let ramount = this.fromUnit(sendAmount);

                if(parseFloat(ramount) != parseFloat(amount)){
                    resData.error = 1;
                    resData.message = 'You can send minimum '+ramount+' '+symbol;
                    return reject(resData);
                }
                
                let data = myContract.methods.transfer(toAddress, sendAmount).encodeABI();

                let balance = await _this.getEthBalance(fromAddress);

                if(nonce==0) nonce = await _this.getNonce(fromAddress);

                let gasPrice = this.customGasPrice;
                if(gasPrice==0) gasPrice = await _this.getGasPrice();

                if(balance >= this.gasLimit*gasPrice){
                    
                    let rawTx = {
                        "nonce": this.web3.utils.toHex(nonce),
                        "gasPrice": this.web3.utils.toHex(parseInt(gasPrice)),
                        "gasLimit": this.web3.utils.toHex(this.gasLimit),
                        "to": this.contractAddress,
                        "value": "0x00",
                        "data": data
                    };

                    const tx = new Transaction(rawTx,{chain:this.chain});
                    try{
                        tx.sign(fromPkeyB);
                    }catch(err){
                        resData.error = 1;
                        resData.message = 'Invalid Private Key.';
                        reject(resData);
                        return false;
                    }
                    
                    let serializedTx = "0x" + tx.serialize().toString('hex');
                    this.web3.eth.sendSignedTransaction(serializedTx,(err,res)=>{
                        if(err){
                            console.log(err);
                            resData.error = 1;
                            resData.message = 'Something went wrong to broadcast transaction.';

                            reject(resData);
                            return false;
                        }else{
                            resData.error = 0;
                            resData.message = 'Token has been sent Successfully.';
                            resData.txId = res;
                            resData.nonce = nonce;
                            resolve(resData);

                        }
                    });
                }// if balance is available
                else{
                    resData.error = 1;
                    resData.message = 'Insufficient balance for gas.You have ' +balance+' '+this.currency+' but we need '+this.web3.utils.fromWei(`${this.gasLimit*gasPrice}`,'ether');
                    reject(resData);
                }

            }// if address is valid
            else{
                resData.error = 1;
                resData.message = `Invalid Address to send (${toAddress})`;
                reject(resData);
            }
        })
    }
}
