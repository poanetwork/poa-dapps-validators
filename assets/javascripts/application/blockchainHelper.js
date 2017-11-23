function attachToContract(web3, abi, addr) {
  web3.eth.defaultAccount = web3.eth.accounts[0];
  console.log("web3.eth.defaultAccount:" + web3.eth.defaultAccount);
  
  let contractInstance = new web3.eth.Contract(abi, addr);
  
  return contractInstance;
}

function call(web3, acc, contractAddr, data, cb) {
  let props;
  if (acc) props = { from: acc, data: data, to: contractAddr };
  else props = { data: data, to: contractAddr };
  
  web3.eth.call(props, function(err, data) {
    cb(data);
  });
}