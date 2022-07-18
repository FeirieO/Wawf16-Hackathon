const SHA256 = require('crypto-js/sha256');//secure hash algorithms that encripts our blockchain hashID
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    constructor(amount, senderPublicKey, recieverPublicKey) {
      this.amount = amount;
      this.senderPublicKey = senderPublicKey;
      this.recieverPublicKey = recieverPublicKey;
    }

    calculateHash(){
        return SHA256(this.amount, this.senderPublicKey, this.recieverPublicKey).toString()
    }

    signTransaction(signinKey){
        if(signinKey != null & signinKey.getPublic('hex') !== this.senderPublicKey){
            throw new Error('You cannot sign transaction for other wallets');
        }
        const hashTx = this.calculateHash();
        const sig = signinKey.sign(hashTx, "base64");
        this.signature = sig.toDER('hex')
    }

    isValid(){
        if(this.senderPublicKey === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature in this transaction');
        }
        const publicKey = ec.keyFromPublic(this.senderPublicKey, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Wallet {
    constructor() {
        const key = ec.genKeyPair();
        this.publicKey = key.getPublic('hex');
        this.privateKey = key.getPrivate('hex');
      }

      walletLog(){
        return({"private key": this.privateKey, " public key": this.publicKey})
      }
}

class CryptoBlock{
    constructor(/* index, */ timestamp, transaction, precedingHash=" "){
        this.timestamp = timestamp; // keeps record of the time of occurence of each completed transaction
        this.transactions = transaction,
        //this.data = data; // provides data about the completed transactions, such as the sender details, recipient's details, and quantity transaction
        this.precedingHash = precedingHash; // points to the hash of the preceding block in the blockchain, somethimg important in maintaining the blockchain's integrity.
        this.hash = this.computeHash();//returns the hash of the  block
        this.nonce = 0; // the nonce for a block
    }
    computeHash(){
        return SHA256(this.index + this.precedingHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();
    }
    proofOfWork(difficulty){ //same as mineBlock
        while(
            this.hash.substring(0, difficulty) !== Array( difficulty + 1).join("0")
        ) {
            this.nonce++;
            this.hash = this.computeHash();
        }        
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

class CryptoBlockchain{
    constructor(){
        this.blockchain = [this.startGenesisBlock()];
        this.difficulty = 1; 
        this.pendingTransaction = []; // liat of pending transactions
        this.miningReward = 1; // number of cryptocurrency as mining reward    
    }
    startGenesisBlock(){
        return new CryptoBlock(/* 0, */ "01/01/2022", "Initial Block in the Chain", "0");
    }
    obtainLatestBlock(){
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(miningRewardAddress){ // same as mining function
        let newBlock = new CryptoBlock(Date.now(), this.pendingTransaction)
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        //newBlock.hash = newBlock.computeHash();    
        newBlock.proofOfWork(this.difficulty);
        console.log("Block mined")    
        this.blockchain.push(newBlock);
        this.pendingTransaction = [
            new Transaction(this.miningReward, null, miningRewardAddress)
        ];
    } 

    addTransaction(transaction){
        if(!transaction.senderPublicKey || !transaction.recieverPublicKey){
            throw new Error('Transaction must include from and to address')
        }

        if(!transaction.isValid()){
            throw new Error('cannot add invalid transaction to chain')
        }

        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.blockchain){
            for(const trans of block.transactions){
                if(trans.senderPublicKey === address){
                    balance -= trans.amount;
                }
                if(trans.recieverPublicKey === address){
                    balance += trans.amount
                }
            }
        }

        return balance;
    }

    checkChainValidity(){
        for(let i = 1; i < this.blockchain.length; i++){
            const currentBlock = this.blockchain[i];
            const precedingBlock= this.blockchain[i-1];

          if(!currentBlock.hasValidTransactions()){
            return false;
          }

          if(currentBlock.hash !== currentBlock.computeHash()){
              return false;
          }
          if(currentBlock.precedingHash !== precedingBlock.hash)
            return false;
        }
        return true;
    }

}


//module.exports = CryptoBlockchain
//module.exports = Transaction
//module.exports = CryptoBlock
const Wawf16Coin = new CryptoBlockchain();
const cBlock = new CryptoBlock();
console.log("WWWF16Coin has started Mining!")
module.exports = {
    Wallet,
    CryptoBlockchain,
    Transaction,
    cBlock,
    Wawf16Coin
}
