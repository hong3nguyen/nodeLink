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
        setChainlinkToken(0x0E3c944F32BCc729D292F8F0F552145332011104);
        setChainlinkOracle(0xe15e23a8ba28745623382a54b999145C49E70bF9);
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
