// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

contract SimpleCounter {
    uint256 counterValue;

    event CounterUpdated(address indexed _from, uint256 value);

    constructor() {
        counterValue = 0;
    }

    function incrementCounter() public {
        counterValue += 1;

        emit CounterUpdated(msg.sender, counterValue);
    }

    function getCounterValue() public view returns (uint256) {
        return counterValue;
    }
}
