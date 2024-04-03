// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract SimpleChainlink is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    uint256 public volume;

    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

    constructor(){
        //setPublicChainlinkToken();
        setChainlinkToken(0x3f5CBA916576A6Ce277dA066fD210D895a595F71);
        oracle = ; // This should be the oracle address
        jobId = "7d2d7a3d183647b5aaeee7a1d0a24dc7"; // This should be the job id
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    function requestVolumeData() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD");
        request.add("path", "RAW,ETH,USD,VOLUME24HOUR");
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId) {
        volume = _volume;
    }
}