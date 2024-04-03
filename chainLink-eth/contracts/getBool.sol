// SPDX-License-Identifier: MIT
// https://glink.solutions
// Discord=https://discord.gg/KmZVYhYJUy

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract getBoolTemplate is ChainlinkClient, ConfirmedOwner {
  using Chainlink for Chainlink.Request;

  bool public boolean;
  
  bytes32 private externalJobId;
  uint256 private oraclePayment;
  address private oracle;

  event RequestBoolFulfilled(bytes32 indexed requestId,bool indexed boolean);

  constructor() ConfirmedOwner(msg.sender){
  setChainlinkToken(0xA253e5A8E365f12C5dFF86b9F3e948e11d42f3B1);
  oracle = 0x21D726C9f77176aC1304f8A424Eb2dAF5022Ff37;
  externalJobId = "46dae4be0e55435b8d0d408a910d9836";
  oraclePayment = ((14 * LINK_DIVISIBILITY) / 10); // n * 10**18
  }

    event RequestBoolCalled(string message);

  function requestBool()
    public
    onlyOwner
  {
    emit RequestBoolCalled("requestBool function was called");
    Chainlink.Request memory req = buildChainlinkRequest(externalJobId, address(this), this.fulfillBool.selector);
    req.add("get", "https://raw.githubusercontent.com/glinknode/chainlink-public-jobs/main/example-json/example-bool.json");
    req.add("path", "data_bool");
    sendChainlinkRequestTo(oracle, req, oraclePayment);
  }

  function fulfillBool(bytes32 _requestId, bool _boolean)
    public
    recordChainlinkFulfillment(_requestId)
  {
    emit RequestBoolFulfilled(_requestId, _boolean);
    boolean = _boolean;
  }

}