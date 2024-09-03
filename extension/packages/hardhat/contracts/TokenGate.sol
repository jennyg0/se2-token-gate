// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TokenGateContract is Ownable {
    IERC20 public token;
    uint256 public requiredBalance;

    constructor(address _token, uint256 _requiredBalance) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
        requiredBalance = _requiredBalance;
    }

    function hasAccess(address user) public view returns (bool) {
        return token.balanceOf(user) >= requiredBalance;
    }

    function updateRequiredBalance(uint256 _newBalance) public onlyOwner {
        requiredBalance = _newBalance;
    }

    function getTokenBalance(address user) public view returns (uint256) {
        return token.balanceOf(user);
    }
}
