// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address owner;
    mapping(address => bool) public voters;

    uint256 public votingStart;
    uint256 public votingEnd;

    constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(
                Candidate({name: _candidateNames[i], voteCount: 0})
            );
        }
        owner = msg.sender;
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function addCandidate(string memory _name) public onlyOwner {
        candidates.push(Candidate({name: _name, voteCount: 0}));
    }

    function vote(uint256 _candidateIndex) public {
        require(!voters[msg.sender], "You have already voted.");
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
    }

    // New function to retrieve the vote count of a candidate by index
    function getVoteCountOfCandidate(
        uint256 _candidateIndex
    ) public view returns (string memory, uint256) {
        require(
            _candidateIndex < candidates.length,
            "Invalid candidate index."
        );
        return (
            candidates[_candidateIndex].name,
            candidates[_candidateIndex].voteCount
        );
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }

    // Checking if an address has voted
    function hasVoted(address _voter) public view returns (bool) {
        return voters[_voter];
    }

    function getCandidatesCount() public view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(
        uint256 index
    ) public view returns (string memory, uint256) {
        require(index < candidates.length, "Invalid candidate index.");
        return (candidates[index].name, candidates[index].voteCount);
    }
}
