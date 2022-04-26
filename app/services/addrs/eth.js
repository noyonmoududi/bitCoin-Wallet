
exports.getWallet = (private_key_input="") =>{
    return new Promise((resolve,reject)=>{
        let Accounts = require('web3-eth-accounts');
        let accounts = new Accounts();
        let wallet;
        if(private_key_input == '') wallet = accounts.create();
        else wallet = accounts.privateKeyToAccount(private_key_input);

        return resolve({
            'public':wallet.address,
            'private':wallet.privateKey
        });
    });
};
