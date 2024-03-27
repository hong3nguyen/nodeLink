// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract WeatherContract is ChainlinkClient {
    using Chainlink for Chainlink.Request;

    // Specify the Oracle address and Job ID
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    // Variable to store the temperature
    uint256 public temperature;

    // Event to signal the temperature was updated
    event TemperatureUpdated(uint256 temperature);

    constructor() {
        //setPublicChainlinkToken(); // Set the LINK token contract address
        setChainlinkToken(0xB6eFca1fcDDbb3E1950d1AaC422f9CC913Cc602e);
        setChainlinkOracle(0x26fd5013A99bA26505C03D47D0D61Cc66062f071);
        jobId = "12ebf2f1c3d441c4b10728a70bccecc8";
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    // Function to request temperature data
    function requestTemperatureData(string memory city) public {
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add("city", city); // API endpoint might require a city parameter
        sendChainlinkRequestTo(oracle, req, fee);
    }

    // Callback function for the Oracle's response
    function fulfill(bytes32 _requestId, uint256 _temperature) public recordChainlinkFulfillment(_requestId) {
        temperature = _temperature;
        emit TemperatureUpdated(temperature);
    }
}
