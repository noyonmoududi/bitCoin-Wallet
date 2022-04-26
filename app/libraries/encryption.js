

const CryptoJS = require('crypto-js');
const cryptoConfig = loadConfig('cryptoConfig');

exports.encrypt = (text,key) =>{
    var key = key?key:cryptoConfig.encryptionKey?cryptoConfig.encryptionKey:'secret';
    var ciphertext = CryptoJS.AES.encrypt(text, key).toString();
    return ciphertext;
};

exports.decrypt = (ciphertext,key) =>{
    var key = key?key:cryptoConfig.encryptionKey?cryptoConfig.encryptionKey:'secret';
    let bytes  = CryptoJS.AES.decrypt(ciphertext, key);
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
};

