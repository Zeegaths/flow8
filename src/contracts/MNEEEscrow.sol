// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface for the MNEE ERC20 token
 */
interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract MNEEEscrow {
    address public immutable mneeToken;
    address public owner; // The Flow8 platform admin

    struct Project {
        address client;
        address freelancer;
        uint256 amount;
        bool isReleased;
        bool isRefunded;
    }

    mapping(string => Project) public projects;

    event FundsLocked(string projectId, address indexed client, uint256 amount);
    event FundsReleased(string projectId, address indexed freelancer, uint256 amount);

    constructor(address _mneeAddress) {
        mneeToken = _mneeAddress;
        owner = msg.sender;
    }

    /**
     * @notice Locks MNEE from client into this contract
     * @param _projectId Unique ID from your backend
     * @param _freelancer The wallet address of the worker
     * @param _amount Total amount in MNEE (including decimals)
     */
    function lockFunds(string memory _projectId, address _freelancer, uint256 _amount) external {
        require(projects[_projectId].amount == 0, "Project exists");
        require(_amount > 0, "Amount must be > 0");

        // IMPORTANT: Client must call 'approve' on the MNEE contract first
        bool success = IERC20(mneeToken).transferFrom(msg.sender, address(this), _amount);
        require(success, "MNEE transfer failed - did you approve?");

        projects[_projectId] = Project({
            client: msg.sender,
            freelancer: _freelancer,
            amount: _amount,
            isReleased: false,
            isRefunded: false
        });

        emit FundsLocked(_projectId, msg.sender, _amount);
    }

    /**
     * @notice Client releases funds to freelancer
     */
    function releaseFunds(string memory _projectId) external {
        Project storage project = projects[_projectId];
        require(msg.sender == project.client, "Only client can release");
        require(!project.isReleased, "Funds already released");

        project.isReleased = true;
        bool success = IERC20(mneeToken).transfer(project.freelancer, project.amount);
        require(success, "Transfer to freelancer failed");

        emit FundsReleased(_projectId, project.freelancer, project.amount);
    }
}