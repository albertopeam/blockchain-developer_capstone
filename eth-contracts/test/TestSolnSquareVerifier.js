const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const truffleAssert = require('truffle-assertions');
const CorrectProof = require('./correct-proof.json');
const CorrectProof2 = require('./correct-proof2.json');
const IncorrectProof = require('./incorrect-proof.json');

contract('SolnSquareVerifier', accounts => {
    const account_one = accounts[0];
    const tokenId = 1;
    const secondTokenId = 2;

    describe('SolnSquareVerifier spec', function () {
        beforeEach(async function () { 
            const verifier = await SquareVerifier.new({from: account_one})
            this.contract = await SolnSquareVerifier.new(verifier.address, {from: account_one});
        })

        it('given a valid proof when mint then create token', async function () { 
            let transaction = await this.contract.mintToken(account_one, tokenId, CorrectProof.proof, CorrectProof.inputs, {from: account_one});
            assert.equal(await this.contract.ownerOf(tokenId), account_one);
            truffleAssert.eventEmitted(transaction, 'AddedSolution', (event) => {
                return event.index == 0 && event.addr == account_one;
            });
        })

        it('given a two valid proofs when mint twice then  token', async function () { 
            await this.contract.mintToken(account_one, tokenId, CorrectProof.proof, CorrectProof.inputs, {from: account_one});
            let transaction = await this.contract.mintToken(account_one, secondTokenId, CorrectProof2.proof, CorrectProof2.inputs, {from: account_one});
            truffleAssert.eventEmitted(transaction, 'AddedSolution', (event) => {
                return event.index == 1 && event.addr == account_one;
            });
        })

        it('given a valid proof but used twice then throw', async function () { 
            await this.contract.mintToken(account_one, tokenId, CorrectProof.proof, CorrectProof.inputs, {from: account_one});
            await truffleAssert.fails(
                this.contract.mintToken(account_one, tokenId, CorrectProof.proof, CorrectProof.inputs, {from: account_one}),
                "Solution was used previously, its need a unique solution to mint new tokens"
            );            
         })

        it('given an invalid proof when mint then throw', async function () { 
            await truffleAssert.fails(
                this.contract.mintToken(account_one, tokenId, IncorrectProof.proof, IncorrectProof.inputs, {from: account_one}),
                "Invalid proof or input"
            );  
        })
    })
})