// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage{


    mapping(uint => uint) public aa; //slot 0
    mapping(address => uint) public bb; //slot 1

    //keccak256(slot . indexOfItem)
    uint[] public cc; //slot2


    uint8 public a = 7; //slot 3
    uint16 public b = 10; //slot 4
    address public c = 0x6F69105EfF8409C78CfE5aAb9F2692f9c7955e25;
    bool d = true;
    uint64 public e = 15;


    uint256 public f = 200;
    uint8 public g = 40;
    uint256 public h = 789;

    constructor(){

        cc.push(1);
        cc.push(10);
        cc.push(100);
        aa[2] = 4;
        aa[3] = 10;
        bb[0x6F69105EfF8409C78CfE5aAb9F2692f9c7955e25] = 100;
    }

    //web3.eth.getStorageAt("0x52B1401D73e6594D5ACCd3ed0C6A3955eFB73c8d", 0)

    // 0x00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000 this is key for first mapping
    // 0x0000000000000000000000000000000000000000000000000000000000000000 this is slot for first mapping, first 32 bytes keep key of mapping next 32 bytes keep slot number.

    // 0x0000000000000000000000006F69105EfF8409C78CfE5aAb9F2692f9c7955e250000000000000000000000000000000000000000000000000000000000000001 this is key for first mapping
    // 0x0000000000000000000000000000000000000000000000000000000000000000 this is slot for first mapping, first 32 bytes keep key of mapping next 32 bytes keep slot number.


    //0x0000000000000000000000000000000000000000000000000000000000000002
    // 29102676481673041902632991033461445430619272659676223336789171408008386403023 decimal value. This plus index of item 
}