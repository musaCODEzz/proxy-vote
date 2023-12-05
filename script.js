document.addEventListener('DOMContentLoaded', () => {
    const connectButton = document.getElementById('connectButton');
  
    connectButton.addEventListener('click', async () => {
      try {
        // Connect to MetaMask
        await connectMetamask();
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    });
  });
  
  const connectMetamask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const walletAddress = await signer.getAddress();

        // Store the wallet address or some indication of connection in localStorage or sessionStorage
      localStorage.setItem('walletAddress', walletAddress);
      
        alert(`Connected to MetaMask! Wallet Address: ${walletAddress}`);
        
        // Redirect to voting page after successful connection
        window.location.href = 'vote.html'; // Change 'vote.html' to your voting page
      } catch (error) {
        throw new Error('MetaMask connection error:', error);
      }
    } else {
      throw new Error('MetaMask extension not detected');
    }
  };
  
  