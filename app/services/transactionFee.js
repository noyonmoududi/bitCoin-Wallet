
class trasactionFee {
    async getFee (currency,fromPublicKey,privateKey, outputs,network='mainnet'){

        if(currency.toUpperCase()=='BTC'){
            return 10000;
        }
        return 0;
    }
}

module.exports = trasactionFee;