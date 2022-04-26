module.exports = {
    cryptoNetwork:process.env.CRYPTO_NETWORK?process.env.CRYPTO_NETWORK:'testnet',
    encryptionKey:(process.env.ENCRYPTION_KEY||'secret-encryption'),
    allowedCurrencies:(process.env.ALLOWED_CURRENCIES?process.env.ALLOWED_CURRENCIES.split(','):[]),
    masterAddress:{
        btc:{
            mainnet:process.env.BTC_MAINNET_MASTER_ADDRESS,
            testnet:process.env.BTC_TESTNET_MASTER_ADDRESS
        },
        eth:{
            mainnet:process.env.ETH_MAINNET_MASTER_ADDRESS,
            testnet:process.env.ETH_TESTNET_MASTER_ADDRESS
        }
    },
    rewardSendingAddress:process.env.REWARD_SEND_ADDRESS,
    rewardSendingAddressPK:process.env.REWARD_SEND_ADDRESS_PK,
    btcTransactionFee: process.env.BTC_TRANSACTION_FEE?Number(process.env.BTC_TRANSACTION_FEE):100000
}