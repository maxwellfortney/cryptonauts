// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract Cryptonauts is ERC721Enumerable, Ownable {
    bytes32 public LAST_HASH;
    address payable wallet;
    uint public firstLaunch;

    mapping(address => uint) public cryptonautLaunchDates;

    constructor(address payable _wallet) ERC721("Cryptonauts", "CNAUTS") {
        wallet = _wallet;
        firstLaunch = block.timestamp + 1 weeks;
    }

    function changeWallet(address payable _newWallet) public onlyOwner {
        wallet = _newWallet;
    }

    // This is our `blockchain` (hash + block.timestamp)
    bytes32[] TOKEN_HASHES;

    // Mining Vars
    uint BASE_COST = 0.000045 ether;
    uint BASE_DIFFICULTY = uint(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff)/uint(300);
    uint DIFFICULTY_RAMP = 3;

    //Mining Events
    event Mined(uint indexed _tokenId, bytes32 hash);

    // Mining  Functions
    function generationOf(uint _tokenId) private pure returns(uint generation){
        for(generation = 0; _tokenId > 0; generation++){
            _tokenId /= 2;
        }
        return generation - 1;
    }

    function hashOf(uint _tokenId) public view returns(bytes32){
        require(_exists(_tokenId), "Invalid tokenId: does not exist.");
        return TOKEN_HASHES[_tokenId];
    }

    function mine(uint nonce) external payable {
        uint tokenId = TOKEN_HASHES.length + 1;
        uint generation = generationOf(tokenId);

        uint difficulty = BASE_DIFFICULTY / (DIFFICULTY_RAMP**generation);
        if(generation > 13){ //Token 16384
            difficulty /= (tokenId - 2**14 + 1);
        }

        uint cost = (2**generation - 1)* BASE_COST;

        // Confirm the hash is below is target
        bytes32 hash;
        hash = keccak256(abi.encodePacked(
                msg.sender,
                LAST_HASH,
                nonce
            ));

        require(uint(hash) < difficulty, "This hash does not fall under the difficulty. Keep mining!");
        require(msg.value >=cost, "Cost of token is not met");

        // Get new hash we will emit to miners
        hash = keccak256(abi.encodePacked(hash, block.timestamp));
        LAST_HASH = hash;
        TOKEN_HASHES.push(hash);

        _mint(msg.sender, tokenId);

        emit Mined(tokenId, hash);
        wallet.transfer(msg.value);
    }

    // Burn and add to launch list
    function burn(uint256 tokenId) public {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721Burnable: caller is not owner nor approved");
        _burn(tokenId);

        uint myLaunchDate = firstLaunch;
        while(block.timestamp >  myLaunchDate) {
            myLaunchDate += 1 weeks;
        }

        cryptonautLaunchDates[msg.sender] = myLaunchDate;
    }
}