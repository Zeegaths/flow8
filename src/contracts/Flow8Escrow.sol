// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

contract Flow8Escrow {
    struct Project {
        address client;
        address freelancer;
        uint256 amount;
        bool isReleased;
        bool isRefunded;
    }

    IERC20 public mneeToken;
    mapping(string => Project) public projects;

    event FundsLocked(string projectId, address client, uint256 amount);
    event FundsReleased(string projectId, address freelancer, uint256 amount);

    constructor(address _mneeAddress) {
        mneeToken = IERC20(_mneeAddress);
    }

    function deposit(string memory _projectId, address _freelancer, uint256 _amount) external {
        require(projects[_projectId].amount == 0, "Project already exists");
        
        // Pull MNEE from client to this contract
        require(mneeToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        projects[_projectId] = Project({
            client: msg.sender,
            freelancer: _freelancer,
            amount: _amount,
            isReleased: false,
            isRefunded: false
        });

        emit FundsLocked(_projectId, msg.sender, _amount);
    }

    function release(string memory _projectId) external {
        Project storage project = projects[_projectId];
        require(msg.sender == project.client, "Only client can release");
        require(!project.isReleased, "Already released");

        project.isReleased = true;
        require(mneeToken.transfer(project.freelancer, project.amount), "Transfer failed");

        emit FundsReleased(_projectId, project.freelancer, project.amount);
    }
}