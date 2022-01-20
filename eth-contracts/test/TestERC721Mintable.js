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

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});

            // TODO: mint multiple tokens
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