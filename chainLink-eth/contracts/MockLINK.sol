// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockLINK
 * @dev Mock LINK Token for testing and development.
 * This token is a standard ERC20 token that can be used for simulating Chainlink token interactions in a private Ethereum network.
 */
contract LinkToken is ERC20 {
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor(uint256 initialSupply) ERC20("Mock Chainlink Token", "LINK") {
        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Function to mint tokens
     * This function allows new tokens to be created (minted) and sent to the specified address.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
