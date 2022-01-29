const SquareVerifier = artifacts.require('SquareVerifier');
const CorrectProof = require('./correct-proof.json');
const IncorrectProof = require('./incorrect-proof.json');

contract('SquareVerifier', accounts => {
    const account_one = accounts[0];

    describe('SquareVerifier spec', function () {
        beforeEach(async function () { 
            this.contract = await SquareVerifier.new({from: account_one});
        })

        it('given a valid proof when verify then returns true', async function () { 
            let result = await this.contract.verifyTx(CorrectProof.proof, CorrectProof.inputs);
            assert.equal(result, true);
        })

        it('given an invalid proof when verify then returns false', async function () { 
            let result = await this.contract.verifyTx(IncorrectProof.proof, IncorrectProof.inputs);
            assert.equal(result, false);
        })
    })
})

