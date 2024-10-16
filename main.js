const sha256 = require('crypto-js/sha256'); //sha256 is a hashing function, think it of as a random string which is unique to match the chains of your previous and next block in a block chain
class Block{
    constructor(index, timestamp, data, previousHash = ''){ //constructors are nothing but building blocks you might use to build a house
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }
    calculateHash(){
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();  //we convert the hash to string so that we can read it in a human readable format
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }
    createGenesisBlock(){
        return new Block(0, "01/01/2024", "Genesis Block", "0"); // sample data
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]; //to fetch the latest block in the chain or the last block in the chain   
    }

    addblock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash; //this is the most important part of the block chain, this is where the chain is created
        newBlock.hash = newBlock.calculateHash(); //this is the hash of the block which is calculated using the calculateHash function
        this.chain.push(newBlock); //this is where the block is added to the chain
    }

    isChainValid(){ // to validate the chains 
        for(let i=1;i<this.chain.length;i++){
            const currentBlock = this.chain[i]; 
            const previousblock = this.chain[i-1];    
            //the above two are the current block and the previous block in the chain 
            if(currentBlock.hash!== currentBlock.calculateHash())return false;
            //if the current block hash is not equal to the calculated hash of the current block then return false
            if(currentBlock.previousHash!==previousblock.hash)return false;
            //if the current block previous hash is not equal to the previous block hash then return false
        }
        return true;
    }
}

let myCoin = new Blockchain();
//adding blocks
myCoin.addblock(new Block(1, "01/02/2024", { amount: 4 }));
myCoin.addblock(new Block(2, "01/03/2024", { amount: 10 }));

console.log('Is blockchain valid? ' + myCoin.isChainValid());

myCoin.chain[1].data = { amount: 100 };
console.log('Is blockchain valid? ' + myCoin.isChainValid());
myCoin.chain[1].hash = myCoin.chain[1].calculateHash();

// console.log(JSON.stringify(myCoin, null, 4)); //use this to print the data in readable format