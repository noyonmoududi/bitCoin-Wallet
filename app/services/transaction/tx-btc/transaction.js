'use strict';
Object.defineProperty(exports, '__esModule', { value: true });const secp256k1 = require('secp256k1');
const { hash160 } = require('./crypto');
const utils = require('./utils');

class Transaction {
    constructor(){
        this.tx = { version: 1, locktime: 0, vins: [], vouts: [] };
        this.balance=0;
        this.hex = '';
    }

    addInput(utxo){
      let inputs = [];
      if(Array.isArray(utxo)) inputs = utxo; 
      else inputs.push(utxo);;
      for(let i=0;i<inputs.length;i++){
        let input = inputs[i];
        if(!('txid' in input) || !('satoshi' in input) || !('index' in input)) throw 'Incorrect format of UTXO (Required txid,index and satoshi in input object)';
        this.tx.vins.push({
          txid: Buffer.from(input.txid, 'hex'),
          vout: input.index,
          hash: Buffer.from(input.txid, 'hex').reverse(),
          sequence: 0xffffffff,
          script: null,
          scriptSig: null,
        });
        this.balance = this.balance+parseInt(input.satoshi);
      }
        
    }

    addOutput(address,satoshi){
        this.tx.vouts.push({
            script: utils.p2pkhScript(utils.fromBase58Check(address).hash),
            value: satoshi
          });
    }

    addChange(address,satoshi){
      this.tx.vouts = [{
        script: utils.p2pkhScript(utils.fromBase58Check(address).hash),
        value: satoshi
      }].concat(this.tx.vouts)
    }
  
    signInput(privateKey){
      if(this.tx.vins.length==0) throw 'Input is required to add first';
      if(this.tx.vouts.length==0) throw 'Output is required to add first';

      let privKey = Buffer.from(
        privateKey,
        'hex'
      );
      let pubKey = secp256k1.publicKeyCreate(privKey);

      for(let i=0; i<this.tx.vins.length;i++){
        this.tx.vins[i].script = utils.p2pkhScript(hash160(pubKey))
      }
      for(let i=0; i<this.tx.vins.length;i++){
        this.tx.vins[i].scriptSig = utils.p2pkhScriptSig(utils.signp2pkh({...this.tx}, i, privKey, 0x1), pubKey);
      }
    }

    getSize(){
      if(this.hex != '') return this.hex.length/2;
      else return  utils.txToBuffer(this.tx).length;
    }

    toHex(){
      this.hex = utils.txToBuffer(this.tx).toString('hex');
      return this.hex;
    }
}

exports.Transaction = Transaction;