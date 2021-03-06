// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet{
    //storage variables

    // address payable [] public funders;
    uint public numberOfFunders;
    mapping(uint => address) public fundersList;
    mapping(address => bool) public funders;
    

    receive() external payable{
    }

    function addFunds() public payable override {
        
        address funder = msg.sender;
        if (!funders[funder]){
            uint index = numberOfFunders++;
            // numberOfFunders++;
            funders[funder] = true;
            fundersList[index] = msg.sender;


        }
        // funders.push(payable(msg.sender));
    }

    modifier LessThanMaximum(uint amount){
        require(amount <= 0.1 ether, "You can only withdraw amounts less that 0.1 ether");
        _;
    }

    
    function getFunders(uint index) public view returns(address){
        return fundersList[index];
    }

    function getAllFunders() public view returns(address[] memory){
        address[] memory _funders = new address[](numberOfFunders);
        for(uint i=0; i<numberOfFunders; i++){
            _funders[i] = fundersList[i];
        }
        return _funders;
    }

    function withdrawFunds(uint amount) public override LessThanMaximum(amount) {
        
        payable(msg.sender).transfer(amount);
    }

    function transferOwnerShip(address newOwner) public OnlyAdmin{
        owner = newOwner;
    }

    function emitLog() public override pure returns(bytes32){
        return "Hello World";
    }

    

} 

// const instance = await Faucet.deployed()
//instance.functioncall.
//instance.withdrawFunds("100000000000000000", {from: accounts[2]})
//instance.addFunds({value:"2000000000000000000", from: accounts[2]})
// instance.getFunders(0)
//instance.getAllFunders()