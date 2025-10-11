// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Counter} from "./Counter.sol";
import {Test} from "forge-std/Test.sol";

contract CounterTest is Test {
  Counter counter;

  function setUp() public {
    counter = new Counter();
  }

  function test_InitialValue() public view {
    require(counter.x() == 0, "Initial value should be 0");
  }

  function test_IncIncrementsByOne() public {
    counter.inc();
    assertEq(counter.x(), 1, "Calling inc once should increment x to 1");
  }

  function test_IncEmitsEvent() public {
    vm.expectEmit(true, false, false, true, address(counter));
    emit Counter.Increment(1);
    counter.inc();
  }

  function test_IncByUpdatesValue() public {
    uint256 amount = 5;
    vm.expectEmit(true, false, false, true, address(counter));
    emit Counter.Increment(amount);
    counter.incBy(amount);
    assertEq(counter.x(), amount, "incBy should add the provided amount");
  }

  function test_IncFromDifferentAddresses() public {
    address alice = address(0x1);
    address bob = address(0x2);

    vm.prank(alice);
    counter.inc();

    vm.prank(bob);
    counter.inc();

    assertEq(counter.x(), 2, "Increments from different accounts should accumulate");
  }

  function testFuzz_IncByPositive(uint128 amount) public {
    vm.assume(amount > 0);
    vm.assume(amount < type(uint128).max / 2);

    vm.expectEmit(true, false, false, true, address(counter));
    emit Counter.Increment(amount);
    counter.incBy(amount);

    assertEq(counter.x(), amount, "x should equal the increment amount");
  }

  function testFuzz_Inc(uint8 x) public {
    for (uint8 i = 0; i < x; i++) {
      counter.inc();
    }
    require(counter.x() == x, "Value after calling inc x times should be x");
  }

  function test_IncByZero() public {
    vm.expectRevert(bytes("incBy: increment should be positive"));
    counter.incBy(0);
  }
}
