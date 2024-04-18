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

contract getAddressTemplateTesting is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  address public addressVariable;

  bytes32 private externalJobId;
  uint256 private oraclePayment;

  constructor() {
    // setChainlinkToken(0x26fd5013A99bA26505C03D47D0D61Cc66062f071); // main0x514910771AF9Ca656af840dff83E8264EcF986CA);
    setChainlinkToken(0x238BDA11EDC5CB0fC96a53A6c3953a6415793e96); // need to make a MOCKLINK for that to convert from Eth to LINK
    setChainlinkOracle(0x0006f26f6489eA3b3f58BCDaFb65271a30130FdB);//(0x1db329cDE457D68B872766F4e12F9532BCA9149b);
    externalJobId = "0ee84d16ab094a2eb65e588aaeede290";
    //oraclePayment = ((14 * LINK_DIVISIBILITY) / 10); // n * 10**18
    oraclePayment = 14 * 10**17; // 1.4 LINK tokens
  }

  event RequestFulfilled(bytes32 indexed requestId,address indexed addressVariable);

  function RequestAddress()
    public
  {
    Chainlink.Request memory req = buildChainlinkRequest(externalJobId, address(this), this.fulfillAddress.selector);
     req.add("get", "https://raw.githubusercontent.com/glinknode/chainlink-public-jobs/main/example-json/example-address.json");
     req.add("path1", "data_address");
    //req.add("get", "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    sendOperatorRequest(req, oraclePayment);
  }

  function fulfillAddress(bytes32 requestId,address _addressVariable)
    public
    recordChainlinkFulfillment(requestId)
  {
    emit RequestFulfilled(requestId, _addressVariable);
    addressVariable = _addressVariable;
  }

}