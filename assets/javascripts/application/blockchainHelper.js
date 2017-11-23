function attachToContract(web3, abi, addr) {
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log("web3.eth.defaultAccount:" + web3.eth.defaultAccount);
  
  let contractInstance = new web3.eth.Contract(abi, addr);
  
  return contractInstance;
}