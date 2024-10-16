const sha256 = require('crypto-js/sha256'); //sha256 is a hashing function, think it of as a random string which is unique to match the chains of your previous and next block in a block chain
class Block{
    constructor(index, timestamp, data, previousHash = ''){ //constructors are nothing but building blocks you might use to build a house
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        return sha256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)+this.nonce).toString();  //we convert the hash to string so that we can read it in a human readable format
    }
    /*this is a important topic so take notes
    So mining is a concept in bitcoin to create a new block in the chain, so the miners have to solve a complex mathematical problem to create a new block in the chain
    so the problem is to find a hash that starts with a certain number of 0's, so the more 0's the more difficult it is to mine the block
    generally the hash function consists of 64 characters, so the more 0's the more difficult it is to mine the block
    Single Zero (Difficulty 1): 
The hash must start with 0.
Probability: 1 in 16 (since a hexadecimal digit can be 0-9 or a-f, there are 16 possible values).
Two Zeros (Difficulty 2):

The hash must start with 00.
Probability: 1 in 256 (16 * 16).
Three Zeros (Difficulty 3):

The hash must start with 000.
Probability: 1 in 4,096 (16 * 16 * 16).
Four Zeros (Difficulty 4):

The hash must start with 0000.
Probability: 1 in 65,536 (16^4).
    */
    mineBlock(difficulty){ //method to mine the block
    while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){ // this adds the substring from the 0th index to difficulty(n-th index) and checks if it is equal to the array of difficulty+1 zeros
        //until this is equal this goes on
        this.nonce++; //this is the number of attempts to mine the block
        this.hash = this.calculateHash(); //this is the hash of the block
    }
    console.log("Block mined: " + this.hash);
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
        newBlock.mineBlock(4);
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
