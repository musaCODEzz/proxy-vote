let walletAddress = "";
let contractAddress = "0x14Bd8A27E549f3ECD6c597D481b320a4D2674eA1";
let contractAbi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_candidateNames",
          "type": "string[]"
        },
        {
          "internalType": "uint256",
          "name": "_durationInMinutes",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        }
      ],
      "name": "addCandidate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "candidates",
      "outputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "voteCount",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllVotesOfCandiates",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "internalType": "struct Voting.Candidate[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getRemainingTime",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVotingStatus",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_candidateIndex",
          "type": "uint256"
        }
      ],
      "name": "vote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "voters",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingEnd",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "votingStart",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
const expectedChainId = 11155111;

const connectMetamask = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      walletAddress = await signer.getAddress();
      
      // Store the wallet address or some indication of connection in localStorage or sessionStorage
      localStorage.setItem('walletAddress', walletAddress);
      //alert(`Connected to MetaMask! Wallet Address: ${walletAddress}`);
      
       // Redirect to voting page after successful connection
      window.location.href = 'vote.html'; 
    } catch (error) {
      throw new Error('MetaMask connection error:', error);
    }
  } else {
    throw new Error('MetaMask extension not detected');
  }
};

// Check MetaMask connection status and address on other pages
const checkMetamaskConnection = async () => {
  if (window.ethereum) {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletAddress) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      
      // Use the stored wallet address to check if the signer matches
      const currentAddress = await signer.getAddress();
      if (currentAddress.toLowerCase() === storedWalletAddress.toLowerCase()) {
        // Proceed with actions like voting using the stored walletAddress
        // Example: Perform voting actions using the stored walletAddress
        // ...
      } else {
        // If the stored wallet address doesn't match the current signer, handle it accordingly
        window.location.href = 'index.html'; // Redirect to the initial connection page
      }
    } else {
      // If walletAddress is not found, redirect the user back to connect on the index.html or handle accordingly
      window.location.href = 'index.html'; // Redirect to the initial connection page
    }
  } else {
    throw new Error('MetaMask extension not detected');
  }
};

// Determine the current page and call the appropriate function
const currentPage = window.location.pathname;

if (currentPage === '/index.html') {
  // Call connectMetamask function if it's the index.html page
  connectMetamask();
} else if (currentPage === '/vote.html') {
  // Call checkMetamaskConnection function if it's the dashboard.html or vote.html page
  checkMetamaskConnection();
}


 const addVote = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      // Check the network chain ID
      if (network && network.chainId !== expectedChainId) {
        var cand = document.getElementById("cand");
        cand.innerHTML = "Please switch to the correct network";
        return;
      }

      const storedWalletAddress = localStorage.getItem('walletAddress');

      if (storedWalletAddress) {
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        var name = document.getElementById("vote");
        var cand = document.getElementById("cand");
        cand.innerHTML = "Please wait, checking your vote status";

        try {
          // Check if the user's wallet address has already voted
                    // If the user hasn't voted yet, proceed to vote
          cand.innerHTML = "Please wait, adding a vote in the smart contract";
          const tx = await contractInstance.vote(name.value);
          await tx.wait();
          cand.innerHTML = "Vote added!";
        } catch (error) {
          console.error('Error adding vote:', error);
          cand.innerHTML = "Failed to add vote";
        }
      } else {
        var cand = document.getElementById("cand");
        cand.innerHTML = "Please connect MetaMask first";
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      var cand = document.getElementById("cand");
      cand.innerHTML = "Error connecting to MetaMask";
    }
  } else {
    var cand = document.getElementById("cand");
    cand.innerHTML = "MetaMask extension not detected";
  }
};


const voteStatus = async () => {
  try {
    const storedWalletAddress = localStorage.getItem('walletAddress');

    if (storedWalletAddress && storedWalletAddress !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
      
      const status = document.getElementById("status");
      const remainingTime = document.getElementById("time");
      
      const currentStatus = await contractInstance.getVotingStatus();
      const time = await contractInstance.getRemainingTime();
      
      status.innerHTML = currentStatus === 1 ? "Voting is currently open" : "Voting is finished";
      remainingTime.innerHTML = `Remaining time is ${parseInt(time, 16)} seconds`;
    } else {
      const status = document.getElementById("status");
      status.innerHTML = "Please connect MetaMask first";
    }
  } catch (error) {
    console.error('Error fetching vote status:', error);
    const status = document.getElementById("status");
    status.innerHTML = "Failed to fetch vote status";
  }
};


// const getAllCandidates = async() => {
//     if(walletAddress != 0) {
//         var p3 = document.getElementById("p3");
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         await provider.send("eth_requestAccounts", []);
//         const signer = provider.getSigner();
//         const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
//         p3.innerHTML = "Please wait, getting all the candidates from the voting smart contract";
//         var candidates = await contractInstance.getAllVotesOfCandiates();
//         console.log(candidates);
//         var table = document.getElementById("myTable");

//         for (let i = 0; i < candidates.length; i++) {
//             var row = table.insertRow();
//             var idCell = row.insertCell();
//             var descCell = row.insertCell();
//             var statusCell = row.insertCell();

//             idCell.innerHTML = i;
//             descCell.innerHTML = candidates[i].name;
//             statusCell.innerHTML = candidates[i].voteCount;
//         }

//         p3.innerHTML = "The tasks are updated"
//     }
//     else {
//         var p3 = document.getElementById("p3");
//         p3.innerHTML = "Please connect metamask first";
//     }
// }
// ... (other parts of your code)

const getAllCandidates = async () => {
  if (window.ethereum) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();

      // Check the network chain ID
      if (network && network.chainId !== expectedChainId) {
        const p3 = document.getElementById("p3");
        p3.innerHTML = "Please switch to the correct network";
        return;
      }

      const storedWalletAddress = localStorage.getItem('walletAddress');

      if (storedWalletAddress) {
        const signer = await provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
        const p3 = document.getElementById("p3");
        p3.innerHTML = "Please wait, getting all the candidates from the voting smart contract";

        const table = document.getElementById("myTable").getElementsByTagName('tbody')[0];
        table.innerHTML = ''; // Clear existing table content

        const candidatesCount = await contractInstance.getCandidatesCount(); // Use the new function
        for (let i = 0; i < candidatesCount; i++) {
          const candidateData = await contractInstance.getCandidate(i); // Use the function to fetch candidate by index
          const row = table.insertRow();
          const idCell = row.insertCell(0);
          const descCell = row.insertCell(1);
          const statusCell = row.insertCell(2);

          idCell.textContent = i + 1;
          descCell.textContent = candidateData.name; // candidate name
          statusCell.textContent = candidateData.voteCount; // vote count
        }

        p3.innerHTML = "The candidates' list has been updated";
      } else {
        const p3 = document.getElementById("p3");
        p3.innerHTML = "Please connect MetaMask first";
      }
    } catch (error) {
      console.error('MetaMask connection error:', error);
      const p3 = document.getElementById("p3");
      if(p3){
        p3.innerHTML = "Error connecting to MetaMask";
      }else{
        console.log("p3 not found");
      }
     
    }
  } else {
    const p3 = document.getElementById("p3");
    p3.innerHTML = "MetaMask extension not detected";
  }
};

// getAllCandidates(); // Call the function immediately when the script loads

  getAllCandidates(); // Call the function immediately when the DOM content is loaded

