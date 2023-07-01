// SPDX-License-Identifier: MIT

interface IPUSHCommInterface {
    function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
}


pragma solidity ^0.8.9;

contract w3pay {
    event transactions(address indexed from, address to, uint amount, string symbol);
    event recipeints(address indexed reecipientOf, address recipient, string recipientName);

    function _transfer(address payable _to, string memory symbol) public payable {
        _to.transfer(msg.value);
        sendNotifications(_to, " Payment Received ", " Successfully!" );
        emit transactions(msg.sender, _to, msg.value, symbol);
    }

    function saveTx(address from, address to, uint amount, string memory symbol) public {
        emit transactions(from, to, amount, symbol);
    }

    function addRecipient(address recipient, string memory name) public {
        emit recipeints(msg.sender, recipient, name);
    } 

    address public  EPNS_COMM_ADDRESS = 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa;
    address public channelAddress;

    constructor(address _channelAddress){
        channelAddress = _channelAddress;
    }
    
    function setChannelAddress(address _channelAddress) public {
        channelAddress = _channelAddress;
    }

                            // Wallet address you want to send msg. 
    function sendNotifications(address _to , string memory _msg1, string memory _msg2) public returns (bool) {
        
        IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
            channelAddress , // Channel Address
            _to, 
            bytes(
                string(             
                    abi.encodePacked(
                        
                        "0", 
                        "+", 
                        "3", 
                        "+", 
                        "New Message!",
                        "+", 
                        msg.sender,
                        _msg1, 
                        " sent ",
                        _msg2, 
                        "Message Received!"
                    )
                )
            )
        );

        return true;
    }
}

