// SPDX-License-Identifier: MIT
// https://glink.solutions
// Discord=https://discord.gg/KmZVYhYJUy

/**
 * THIS IS AN EXAMPLE CONTRACT WHICH USES HARDCODED VALUES FOR CLARITY.
 * THIS EXAMPLE USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */

pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract getAddressTemplateOrigin is ChainlinkClient {
  using Chainlink for Chainlink.Request;

  address public addressVariable;
  address public oracle;

  bytes32 private externalJobId;
  uint256 private oraclePayment;

  int public test;

  uint256 public volume;

  event RequestFulfilled(bytes32 indexed requestId,address indexed addressVariable);
  event Log(string message); // log event

  event DataFullfilled(uint256 volume);

  constructor() {
    //setPublicChainlinkToken();
    setChainlinkToken(0x3f5CBA916576A6Ce277dA066fD210D895a595F71);
    //oracle = "0x0006f26f6489eA3b3f58BCDaFb65271a30130FdB"; // This should be the oracle address
    setChainlinkOracle(0x238BDA11EDC5CB0fC96a53A6c3953a6415793e96);
    externalJobId = "92436ce19ae64769b60c6b8416b8304f"; // This should be the job id

    oraclePayment = ((14 * LINK_DIVISIBILITY) / 10); // n * 10**18
    oracle = 0x238BDA11EDC5CB0fC96a53A6c3953a6415793e96;
    test = 0;
  }

  function RequestAddress()
    public returns (bytes32 requestId) 
  {
    test = 1;
    emit Log("RequestAddress");
    Chainlink.Request memory req = buildChainlinkRequest(externalJobId, address(this), this.fulfillAddress.selector);
    req.add("get", "https://raw.githubusercontent.com/glinknode/chainlink-public-jobs/main/example-json/example-address.json");
    req.add("path1", "data_address");

    emit Log("sendOperatorRequest");
    sendOperatorRequest(req, oraclePayment);
    //sendOperatorRequest(req, oraclePayment);
    // Sends the request
    return sendChainlinkRequestTo(oracle, req, oraclePayment);
  }

  function fulfillAddress(bytes32 requestId,address _addressVariable)
    public
    recordChainlinkFulfillment(requestId)
  {
    test = 2;    
    emit Log("fulfillAddress");
    emit RequestFulfilled(requestId, _addressVariable);
    addressVariable = _addressVariable;
  }

  /**
    * Create a Chainlink request to retrieve API response, find the target
    * data, then multiply by 1000000000000000000 (to remove decimal places from data).
    */
  function requestVolumeData() public returns (bytes32 requestId) {
    test = 1;
    Chainlink.Request memory request = buildChainlinkRequest(
        externalJobId,
        address(this),
        this.fulfill.selector
    );

    // Set the URL to perform the GET request on
    request.add(
        "get",
        "https://min-api.cryptocompare.com/data/pricemultifull?fsyms=ETH&tsyms=USD"
    );

    // Set the path to find the desired data in the API response, where the response format is:
    // {"RAW":
    //   {"ETH":
    //    {"USD":
    //     {
    //      "VOLUME24HOUR": xxx.xxx,
    //     }
    //    }
    //   }
    //  }
    request.add("path", "RAW,ETH,USD,VOLUME24HOUR");

    // Multiply the result by 1000000000000000000 to remove decimals
    int timesAmount = 10**18;
    request.addInt("times", timesAmount);

    // Sends the request
    return sendChainlinkRequestTo(oracle, request, oraclePayment);
  }
  /**
    * Receive the response in the form of uint256
    */
  function fulfill(bytes32 _requestId, uint256 _volume)
      public
      recordChainlinkFulfillment(_requestId)
  {
      test = 2;
      volume = _volume;
      emit DataFullfilled(volume);
  }

  function getVolume() public view returns (uint256) {
    return volume;
  }
}