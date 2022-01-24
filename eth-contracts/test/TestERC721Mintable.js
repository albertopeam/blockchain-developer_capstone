const ERC721Mintable = artifacts.require('ERC721Mintable');
const truffleAssert = require('truffle-assertions');

contract('ERC721Mintable', accounts => {

    const zeroAddress = '0x0000000000000000000000000000000000000000';
    const account_one = accounts[0];
    const account_two = accounts[1];
    const nftId = 0;
    const nftId1 = 1;
    const nftId2 = 2;
    const nullNftId = 99;
    const notMintedNftId = 100;
    const baseTokenUri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";
    const tokenName = "real state token";
    const tokenSymbol = "rst";

    describe('ownable spec', function () {
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

    describe('pausable spec', function () {
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

    describe('erc165 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should comply erc165', async function () { 
            let erc165Id = "0x01ffc9a7";
            assert.equal(await this.contract.supportsInterface(erc165Id), true);
        })
    })

    describe('mint spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should fail when minting an address that is not the contract owner', async function () { 
            await truffleAssert.fails(
                this.contract.mint(account_two, notMintedNftId, {from: account_two}),
                "Owner verification failed"
            );
        })

        it('should create a new nft for the provided address and identified with the supplied token id', async function () {
            let transaction = await this.contract.mint(account_two, nftId);

            assert.equal(await this.contract.ownerOf(nftId), account_two);
            assert.equal(await this.contract.balanceOf(account_two), 1);
            truffleAssert.eventEmitted(transaction, 'Transfer', (event) => {
                return event.from == zeroAddress && event.to == account_two && event.tokenId == nftId;
            });
        })

        it('should not create a new nft if it already exists', async function () {
            await this.contract.mint(account_two, nftId);

            await truffleAssert.fails(
                this.contract.mint(account_two, nftId),
                "Can't mint a token that already exists"
            );
        })  

        it('should not create a new nft if the owner is invalid', async function () {
            await truffleAssert.fails(
                this.contract.mint(zeroAddress, nftId1),
                "Invalid address"
            );
        })  
    });

    describe('erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
            await this.contract.mint(account_two, nftId);
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
            assert.equal(await this.contract.balanceOf(account_one), 0);
        })

        it('should get balanceOf for a non empty account', async function () { 
            assert.equal(await this.contract.balanceOf(account_two), 1);
        })

        it('should get owner of token id', async function () { 
            assert.equal(await this.contract.ownerOf(nftId), account_two);
        })

        it('should fail getting the owner of a token id that doesnt exist', async function () { 
            await truffleAssert.fails(
                this.contract.ownerOf(nullNftId),
                "TokenId doesn't represent an NFT"
            );
        })

        it('should not be able to approve for an address that already is the owner', async function () { 
            await truffleAssert.fails(
                this.contract.approve(account_two, nftId, {from: account_two}),
                "Owner can't approve itself"
            );  
        })

        it('should not be able to approve if it was invoked from other than the owner or an authorized operator', async function () { 
            await truffleAssert.fails(
                this.contract.approve(account_one, nftId, {from: account_one}),
                "Sender address is not the owner or approved address is not an authorized operator"
            );  
        })

        it('should be able to approve other account if it was invoked by owner', async function () {     
            let transaction = await this.contract.approve(account_one, nftId, {from: account_two});
            truffleAssert.eventEmitted(transaction, 'Approval', (event) => {
                return event.owner == account_two && event.approved == account_one && event.tokenId == nftId;
            });
        })

        it('should not able to get approved address for a non existing nft', async function () { 
            await truffleAssert.fails(
                this.contract.getApproved(notMintedNftId),
                "TokenId doesn't represent an NFT"
            );
        })  

        it('should able to get approved address for a existing nft', async function () { 
            await this.contract.approve(account_one, nftId, {from: account_two});
            assert.equal(await this.contract.getApproved(nftId), account_one);
        }) 

        it('should return total supply', async function () { 
            
        })

        it('should get token balance', async function () { 
            
        })

        it('should transfer token from one owner to another', async function () { 
            
        })
    });

    describe('erc721 enumerable spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should comply erc721 enumerable', async function () { 
            let erc721EnumerableId = "0x780e9d63";
            assert.equal(await this.contract.supportsInterface(erc721EnumerableId), true);
        })
    })

    describe('erc721 metadata spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721Mintable.new({from: account_one});
        })

        it('should comply erc721 metadata', async function () { 
            let erc721MetadataId = "0x5b5e139f";
            assert.equal(await this.contract.supportsInterface(erc721MetadataId), true);
        })

        it('should comply erc721 funtions', async function () {
            await this.contract.mint(account_two, nftId);

            assert.equal(await this.contract.name(), tokenName);
            assert.equal(await this.contract.symbol(), tokenSymbol);
            assert.equal(await this.contract.baseTokenURI(), baseTokenUri);
            assert.equal(await this.contract.tokenURI(nftId), `${baseTokenUri}${nftId}`);
        })
    })      
})