// migrating the appropriate contracts

console.log("**************************************************");
console.log("DEPLOY CONTRACTS COMMENTED CODE FOR SquareVerifier");
console.log("**************************************************");
//var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  //deployer.deploy(SquareVerifier);
  deployer.deploy(SolnSquareVerifier);
};
