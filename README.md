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

## Zokrates info

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

## Setup

* Development env
  * Truffle v5.4.17 (core: 5.4.17)
  * Solidity v0.5.16 (solc-js)
  * Node v12.22.6
  * Web3.js v1.5.3
  
* start a local eth node using ganache or ganache cli: `ganache-cli --port=8545`
* generate verifier
  * `docker run -v <local_linked_dir>:/home/zokrates/code -ti zokrates/zokrates /bin/bash`
  * `cd code`
  * `zokrates compile -i square.code`
  * `zokrates setup`
  * `zokrates compute-witness -a 3 9`
  * `zokrates generate-proof`
  * `zokrates export-verifier`

* run the tests:
  * `cd eth-contracts`
  * `truffle compile`
  * `truffle test`

* deploy:
  * `truffle deploy --network rinkeby`

## Deployment

* [Deployer account](https://rinkeby.etherscan.io/address/0x54Baa4D0f4f18fb8aCa8Bb5f814d5B97Dd22Bfe5) `0x54Baa4D0f4f18fb8aCa8Bb5f814d5B97Dd22Bfe5`
* [SolnSquareVerifier address](https://rinkeby.etherscan.io/address/0x1Faa715b05f01D6768f61B7BA5A91cD1C20481BD)`0x1Faa715b05f01D6768f61B7BA5A91cD1C20481BD`
* [SquareVerifier address](https://rinkeby.etherscan.io/address/0x58F06f0280117a0384B91b00a9b97537807117D3) `0x58F06f0280117a0384B91b00a9b97537807117D3`

## Tests

* [Contract ABI](https://github.com/albertopeam/blockchain-developer_capstone/blob/master/ABI.json)
* Transactions manually minted using [myetherwallet](https://www.myetherwallet.com/)
  * [transaction 0](https://rinkeby.etherscan.io/tx/0xa69c0d2cf3227436593760ef1e4ecc6dfc4cefb9bfe1679548b53bd23caedaa2)
  * [transaction 1](https://rinkeby.etherscan.io/tx/0xafe113d9108365917c902da1af096e5149fbc1f181ad591672f7f61a4232e7a2)
  * [transaction 2](https://rinkeby.etherscan.io/tx/0x68f110871b0191dde2ed96b62724e797eb2b5eea2ba1f83f9c055037a58d059d)
  * [transaction 3](https://rinkeby.etherscan.io/tx/0x9eb750ce96d10d742bf7da80aad151362748e811451dd64c169b72cdc95f1b1c)
  * [transaction 4](https://rinkeby.etherscan.io/tx/0x820a8c0fe8bc3dff1f6e98f603a82238493987ce6e22dd21131da1f6f54e7c76)
  * [transaction 5](https://rinkeby.etherscan.io/tx/0x15014d7269287bd61eb62879bda4b67ef14b314315467bb52df18bbead49359a)
  * [transaction 6](https://rinkeby.etherscan.io/tx/0xae7b87d437a218150d9ee68126ebfc6e90e9a8146ab01e12db3217bad6c3bcdf)
  * [transaction 7](https://rinkeby.etherscan.io/tx/0x0bb303994c012e92087fd935126141a068b2bd902022f1bc897f6af5d5efbdd1)
  * [transaction 8](https://rinkeby.etherscan.io/tx/0xb076a970692728d910e18f2d24f5af0694409cbf347a11da745e85a8ad461209)
  * [transaction 9](https://rinkeby.etherscan.io/tx/0x3aee65e83c6419fd68b4473585b72f1c26a3166999f68af044c2101b26c15b7e)
* [OpenSea rst token collection](https://testnets.opensea.io/collection/real-state-token-v4)
  * [Info on how to get listed](https://testnets.opensea.io/get-listed/)
  * [Info on how to make an auction](https://docs.opensea.io/docs/6-auctioning-an-item)
  * [Rinkeby faucet if needed](https://faucets.chain.link/rinkeby)
* [Seller account](https://testnets.opensea.io/0x54baa4d0f4f18fb8aca8bb5f814d5b97dd22bfe5) `0x54baa4d0f4f18fb8aca8bb5f814d5b97dd22bfe5`
* [Buyer account](https://testnets.opensea.io/0x400e3113c35debf93f946d581e911587af7275bc) `0x400e3113c35debf93f946d581e911587af7275bc`
  * bought 0
    * [opensea item](https://testnets.opensea.io/assets/0x1faa715b05f01d6768f61b7ba5a91cd1c20481bd/0)
    * [etherscan](https://rinkeby.etherscan.io/tx/0xfb7ca9f40e348ddffb44d3d218a301ebbd63026c656b7e06a49b520a7992e54e)
  * bought 1
    * [opensea item](https://testnets.opensea.io/assets/0x1faa715b05f01d6768f61b7ba5a91cd1c20481bd/1)
    * [etherscan](https://rinkeby.etherscan.io/tx/0xca34fab79c079b3e89d747d8bf5607e2551d215d29a48b5343e0bff5a45d550e)
  * bought 2
    * [opensea item](https://testnets.opensea.io/assets/0x1faa715b05f01d6768f61b7ba5a91cd1c20481bd/2)
    * [etherscan](https://rinkeby.etherscan.io/tx/0xa4eb7a2a35b003e21e7bafc9cfc2b9c5ce641435d304ca3744670a379fbe6fc7)
  * bought 3
    * [opensea item](https://testnets.opensea.io/assets/0x1faa715b05f01d6768f61b7ba5a91cd1c20481bd/4)
    * [etherscan](https://rinkeby.etherscan.io/tx/0x4209fbc024af5f9af8a9897e6c52ce87756559edccc2adb1ad4a527552321cbb)
  * bought 4
    * [opensea item](https://testnets.opensea.io/assets/0x1faa715b05f01d6768f61b7ba5a91cd1c20481bd/3)
    * [etherscan](https://rinkeby.etherscan.io/tx/0x7f0866aadd0e8983ba4fc7497d689425a3b2a4bd0ffbad0939ad4ecadb24a695)