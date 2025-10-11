// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Counter {
  uint public x;
  uint public totalReceived;
  mapping(address => uint) public deposits;

  event Increment(uint by);
  event Funded(address indexed from, uint amount);

  function inc() public {
    x++;
    emit Increment(1);
  }

  function incBy(uint by) public {
    require(by > 0, "incBy: increment should be positive");
    x += by;
    emit Increment(by);
  }

  function fund() public payable {
    _recordFunding(msg.sender, msg.value);
  }

  receive() external payable {
    _recordFunding(msg.sender, msg.value);
  }

  function _recordFunding(address from, uint amount) internal {
    require(amount > 0, "fund: value must be positive");
    totalReceived += amount;
    deposits[from] += amount;
    emit Funded(from, amount);
  }
}
