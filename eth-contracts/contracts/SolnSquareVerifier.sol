pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import './SquareVerifier.sol';
import './ERC721Mintable.sol';

contract SolnSquareVerifier is ERC721Mintable {
    using Counters for Counters.Counter;
    
    /// verifier that validates if invoker knows something, in this case the square of a number
    SquareVerifier private squareVerifier;

    struct Solution {
        /// nth solution added
        uint256 index;
        /// owner of the solution
        address owner;
    }
    /// solutions used previously, it can not be used twice
    mapping(bytes32 => Solution) private _uniqueSolutions;
    /// num of total solutions used
    Counters.Counter private _numUniqueSolutions;
    /// event
    event AddedSolution(uint256 indexed index, address indexed addr);

    constructor(address squareVerifierAddress) public ERC721Mintable() {
        squareVerifier = SquareVerifier(squareVerifierAddress);
    }

    /// @notice Mint a new token
    /// Reverts if the given token ID already exists or address is zero, also if proof is not valid or 
    /// if it was used previously
    /// @param to address the beneficiary that will own the minted token
    /// @param tokenId uint256 ID of the token to be minted
    /// @param proof SquareVerifier.Proof that demostrates that the secret is known
    /// @param input public input
    function mintToken(address to, uint256 tokenId, SquareVerifier.Proof memory proof, uint[2] memory input) public {  
        bytes32 proofHash = hash(proof, input);
        require(_uniqueSolutions[proofHash].owner == address(0), "Solution was used previously, its need a unique solution to mint new tokens");
        require(squareVerifier.verifyTx(proof, input), "Invalid proof or input");
        addSolution(proofHash, to);
        mint(to, tokenId);
    }

    /// @notice Creates a keccka256 from the params
    /// @param proof SquareVerifier.Proof that demostrates that the secret is known
    /// @param input public input
    /// @return hash that identifies the solution
    function hash(SquareVerifier.Proof memory proof, uint[2] memory input) pure internal returns(bytes32 key) {
        return keccak256(abi.encodePacked(proof.a.X, proof.a.Y, proof.a.X, proof.b.Y, proof.c.X, proof.c.Y , input));
    }

    /// @notice Add a valid solution to the unique solutions mapping
    /// @param proofHash hash of the solution to be added as used
    /// @param to address that adds the solution
    function addSolution(bytes32 proofHash, address to) internal {
        uint256 index = _numUniqueSolutions.current();
        _uniqueSolutions[proofHash] = Solution({index: index, owner: to});
        _numUniqueSolutions.increment();
        emit AddedSolution(index, to);
    }
}