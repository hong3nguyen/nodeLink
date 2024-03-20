pragma solidity ^0.8.19;
contract Hello {
  string public message;
  constructor() {
    message = "Hello, World : This is a Solidity Smart Contract on the Private Ethereum Blockchain ";
  }
  
  function setMessage(string memory initialMessage) public {
    message = initialMessage;
  }

  function getMessage() public view returns (string memory){
    return message;
  }
  
}