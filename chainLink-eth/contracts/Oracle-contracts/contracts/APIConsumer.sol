// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract APIConsumer is ChainlinkClient {
    using Chainlink for Chainlink.Request;
    uint256 public volume;
    address public oracle;
    bytes32 public jobId;
    uint256 public fee;

    event DataFullfilled(uint256 volume);

    constructor(
        // address _oracle,
        // //bytes32 _jobId,
        // uint256 _fee,
        // address _link
    ) {
        // if (_link == address(0)) {
        //     //setPublicChainlinkToken();
        //     setChainlinkToken(0x238BDA11EDC5CB0fC96a53A6c3953a6415793e96);
        // } else {
        //     setChainlinkToken(_link);
        // }
        setChainlinkToken(0x238BDA11EDC5CB0fC96a53A6c3953a6415793e96);
        oracle = 0x0006f26f6489eA3b3f58BCDaFb65271a30130FdB;
        //jobId = stringToBytes32(_jobId);
        jobId = "cb74e06535f744a88922b001388b14c3";
        //fee = _fee;
        fee = 0.1 * 10 ** 18; // 0.1 LINK
    }

    /**
     * Create a Chainlink request to retrieve API response, find the target
     * data, then multiply by 1000000000000000000 (to remove decimal places from data).
     */
    function requestVolumeData() public returns (bytes32 requestId) {
        Chainlink.Request memory request = buildChainlinkRequest(
            jobId,
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
        return sendChainlinkRequestTo(oracle, request, fee);
    }

    /**
     * Receive the response in the form of uint256
     */
    function fulfill(bytes32 _requestId, uint256 _volume)
        public
        recordChainlinkFulfillment(_requestId)
    {
        volume = _volume;
        emit DataFullfilled(volume);
    }

    // function stringToBytes32(string memory source) public pure returns (bytes32 result) {
    //     bytes memory tempEmptyStringTest = bytes(source);
    //     if (tempEmptyStringTest.length == 0) {
    //         return 0x0;
    //     }

    //     assembly {
    //         result := mload(add(source, 32))
    //     }
    // }
}
