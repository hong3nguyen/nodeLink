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
  setChainlinkToken(0x0E3c944F32BCc729D292F8F0F552145332011104);
  oracle = 0xe15e23a8ba28745623382a54b999145C49E70bF9;
  externalJobId = "861ba8ef5af045d89a9b5b3d737b068f";
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