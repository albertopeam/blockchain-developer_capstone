const ERC721Mintable = artifacts.require('ERC721Mintable');
const truffleAssert = require('truffle-assertions');

contract('ERC721Mintable', accounts => {

    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('ownable', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should emit when initialized', async function () { 
            let result = await truffleAssert.createTransactionResult(this.contract, this.contract.transactionHash)
            truffleAssert.eventEmitted(result, 'ChangedOwnership', (event) => {
                return event.newOwner === account_one && event.previousOwner === zeroAddress;
            });
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            assert.equal(owner, account_one);
        })

        it('zero addreess can not be the owner', async function () { 
            await truffleAssert.fails(
                this.contract.transferOwnership(zeroAddress),
                "Invalid address"
            );
        })

        it('others than owner can not change ownership', async function () { 
            await truffleAssert.fails(
                this.contract.transferOwnership(account_two, {from: account_two}),
                "Owner verification failed"
            );
        })

        it('only owner can change ownership', async function () { 
            let transaction = await this.contract.transferOwnership(account_two, {from: account_one});
            truffleAssert.eventEmitted(transaction, 'ChangedOwnership', (event) => {
                return event.newOwner === account_two && event.previousOwner === account_one;
            });
        })
    });  

    describe('pausable', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should not be paused after initialize', async function () { 
            let result = await truffleAssert.createTransactionResult(this.contract, this.contract.transactionHash)
            truffleAssert.eventEmitted(result, 'Unpaused', (event) => {
                return event.addr === account_one;
            });
            assert.equal(await this.contract.isPaused(), false);
        })

        it('should not be able to be paused by other than owner', async function () { 
            await truffleAssert.fails(
                this.contract.pause(true, {from: account_two}),
                "Owner verification failed"
            );
        })    

        it('should be able to be paused/unpaused by the owner', async function () { 
            let pauseTransaction = await this.contract.pause(true);
            truffleAssert.eventEmitted(pauseTransaction, 'Paused', (event) => {
                return event.addr === account_one;
            });
            assert.equal(await this.contract.isPaused(), true);

            let unpauseTransaction = await this.contract.pause(false);
            truffleAssert.eventEmitted(unpauseTransaction, 'Unpaused', (event) => {
                return event.addr === account_one;
            });
            assert.equal(await this.contract.isPaused(), false);
        }) 
    });      

    describe('match erc165 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should comply erc165', async function () { 
            let erc165Id = "0x01ffc9a7";
            assert.equal(await this.contract.supportsInterface(erc165Id), true);
        })
    })

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});

            // TODO: mint multiple tokens
        })

        it('should comply erc721', async function () { 
            let erc721Id = "0x80ac58cd";
            assert.equal(await this.contract.supportsInterface(erc721Id), true);
        })

        it('should fail getting balanceOf of zero address', async function () { 
            await truffleAssert.fails(
                this.contract.balanceOf(zeroAddress),
                "Invalid address"
            );
        })

        it('should get balanceOf of zero for an empty account', async function () { 
            assert.equal(await this.contract.balanceOf(account_two), 0);
        })

        it('should get balanceOf for a non empty account', async function () { 
            assert.equal(await this.contract.balanceOf(account_one), 1);
        })

        it('should return total supply', async function () { 
            
        })

        it('should get token balance', async function () { 
            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            
        })

        it('should transfer token from one owner to another', async function () { 
            
        })
    });

    describe('match erc721 enumerable spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should comply erc721 enumerable', async function () { 
            let erc721EnumerableId = "0x780e9d63";
            assert.equal(await this.contract.supportsInterface(erc721EnumerableId), true);
        })
    })

    describe('match erc721 metadata spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should comply erc721 metadata', async function () { 
            let erc721MetadataId = "0x5b5e139f";
            assert.equal(await this.contract.supportsInterface(erc721MetadataId), true);
        })
    })
    
    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            
        })

        it('should return contract owner', async function () { 
        })

    });      
})