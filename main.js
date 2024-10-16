const sha256 = require('crypto-js/sha256');
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0, "01/01/2024", "Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];   
    }

    addblock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i];
            const previousblock = this.chain[i-1];
            if(currentBlock.hash!== currentBlock.calculateHash())return false;
            if(currentBlock.previousHash!==previousblock.hash)return false;
        }
        return true;
    }
}

let myCoin = new Blockchain();
myCoin.addblock(new Block(1, "01/02/2024", { amount: 4 }));
myCoin.addblock(new Block(2, "01/03/2024", { amount: 10 }));

console.log('Is blockchain valid? ' + myCoin.isChainValid());

myCoin.chain[1].data = { amount: 100 };
console.log('Is blockchain valid? ' + myCoin.isChainValid());
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();

// console.log(JSON.stringify(myCoin, null, 4));