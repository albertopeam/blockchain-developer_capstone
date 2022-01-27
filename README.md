# Udacity Blockchain Capstone

The capstone will build upon the knowledge you have gained in the course in order to build a decentralized housing product. 

## Project Resources

* [Remix - Solidity IDE](https://remix.ethereum.org/)
* [Visual Studio Code](https://code.visualstudio.com/)
* [Truffle Framework](https://truffleframework.com/)
* [Ganache - One Click Blockchain](https://truffleframework.com/ganache)
* [Open Zeppelin](https://openzeppelin.org/)
* [Interactive zero knowledge 3-colorability demonstration](http://web.mit.edu/~ezyang/Public/graph/svg.html)
* [Docker](https://docs.docker.com/install/)
* [ZoKrates](https://github.com/Zokrates/ZoKrates)

## Setup

* start a local eth node using ganache or ganache cli: `ganache-cli --port=8545`
* run the tests:
  * `cd eth-contracts`
  * `truffle test`

* zokrates info:
  * https://jspaint.app/#local:1ecabf8d3ef4
  * https://medium.com/extropy-io/zokrates-tutorial-with-truffle-41135a3fb754
  * https://media.consensys.net/introduction-to-zksnarks-with-examples-3283b554fc3b

  ![Alt text](./../docs/zokrates.info.png "zokrates")

  General:
  We can think of this more concretely as having a program, denoted C, taking two inputs: C(x, w). The input x is the public input, and w is the secret witness input. The output of the program is boolean, i.e. either true or false. The goal then is given a specific public input x, prove that the prover knows a secret input w such that C(x,w) == true.
    Program(public_input, witness_input) -> Bool
      being known public_input
      being supposedly know witness
      Program(public_input, witness_input) = true -> prover knows witness

  Detail:
  zk-snarks: consists of three algorithms G, P, V
  * G: Key generator, takes a secret parameter lambda and a program C and generates two publicly available keys, a proving key pk, and a verification key vk. These keys are public parameters that only need to be generated once for a given program C
    (pk, vk) = G(λ, C)
    (proving_key, verification_key) = KeyGenerator(secret_param, program)
  * The prover P takes as input the proving key pk, a public input x and a private witness w. The algorithm generates a proof prf = P(pk, x, w) that the prover knows a witness w and that the witness satisfies the program.
    prf = P(pk, x, w)
    proof = Prover_Algorithm(proving_key, public input, witness)
  
  * The verifier V computes V(vk, x, prf) which returns true if the proof is correct, and false otherwise. Thus this function returns true if the prover knows a witness w satisfying C(x,w) == true.
    verification = V(vk, x, prf)
    verification = V(verification_key, x, proof)
      verification = true => prover knows witness