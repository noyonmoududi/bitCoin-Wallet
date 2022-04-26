const cryptoConfig = loadConfig('cryptoConfig');
const network = cryptoConfig.cryptoNetwork;

response = {
    error:1,
    message:'Unknown',
    txId:null,
    fee:null
};

module.exports = class BaseCryptoTransaction {
    setNetwork(net = network){
        network = (net=='testnet')?'testnet':'mainnet';
    }
};