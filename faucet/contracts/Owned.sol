// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owned{

    address public owner;
    constructor(){
        owner = msg.sender;
    }

    modifier OnlyAdmin {
        require(msg.sender == owner, "You do not have privalages for this function");
        _;
    }

}