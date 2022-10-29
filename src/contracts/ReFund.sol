//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC20.sol";

contract ReFund {
    event BatchDonated(
        address indexed donator,
        address token_address,
        address[] donation_addresses,
        uint256[] donation_amount
    );
    event Donated(
        address indexed donator,
        address token_address,
        address donation_addresses,
        uint256 donation_amount,
        uint256 donated_token_decimal,
        string donated_token_symbol
    );

    function batchDonate(
        address token_address,
        address[] calldata donation_addresses,
        uint256[] calldata donation_amount
    ) external {
        require(
            donation_addresses.length == donation_amount.length,
            "not same number of value and address"
        );
        for (uint256 i = 0; i < donation_addresses.length; ++i) {
            ERC20(token_address).transferFrom(
                msg.sender,
                donation_addresses[i],
                donation_amount[i]
            );
            emit Donated(
                msg.sender,
                token_address,
                donation_addresses[i],
                donation_amount[i],
                ERC20(token_address).decimals(),
                ERC20(token_address).symbol()
            );
        }
        emit BatchDonated(
            msg.sender,
            token_address,
            donation_addresses,
            donation_amount
        );
    }
}
