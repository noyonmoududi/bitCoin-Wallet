const btc = require('./addrs/btc');
const eth = require('./addrs/eth');

module.exports = class cryptowallet{

    async getWallet(currency,private_key_input=""){
        currency = currency.toUpperCase();

        if(currency=='BTC') return btc.getWallet(private_key_input);
        if(currency=='ETH' || currency=='MIKS' || currency=='EBITEMPURA') return eth.getWallet(private_key_input);
        else return null;
    }
}