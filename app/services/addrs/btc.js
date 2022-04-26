const cryptoConfig = loadConfig('cryptoConfig');
exports.getWallet = (private_key_input="") =>{
    const network = cryptoConfig.cryptoNetwork?cryptoConfig.cryptoNetwork:'mainnet';
    return new Promise((resolve,reject)=>{
        const bitcore = require('bitcore-lib');

        let privateKeyWIF;
        if(private_key_input != '') privateKeyWIF = bitcore.PrivateKey(private_key_input,network).toWIF();
        else privateKeyWIF = bitcore.PrivateKey(network).toWIF();
        
        //Generate Bit coin address with private key
        let privateKey = bitcore.PrivateKey.fromWIF(privateKeyWIF);
        let address = privateKey.toAddress();

        let wallet = {
            'private':privateKey.toString(),
            'public':address.toString()
        };
        return resolve(wallet);
    });
};


