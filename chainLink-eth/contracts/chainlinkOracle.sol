// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";


contract ChainlinkOracle is ChainlinkClient {
    uint256 private fee;
    address private oracle;

    constructor(address _link, address _oracle, uint256 _fee) {
        if (_link == address(0)) {
            setPublicChainlinkToken();
        } else {
            setChainlinkToken(_link);
        }
        oracle = _oracle;
        fee = _fee;
    }

    function requestVolumeData(bytes32 _jobId, string memory _url, string memory _path) public  {
        Chainlink.Request memory req = buildChainlinkRequest(_jobId, address(this), this.fulfill.selector);
        req.addString("get", _url);
        req.addString("path", _path);
        sendChainlinkRequestTo(oracle, req, fee);
    }

    function fulfill(bytes32 _requestId, uint256 _volume) public recordChainlinkFulfillment(_requestId) {
        // Handle the fulfillment data here
    }

    function withdrawLink() public  {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
    }
}