function callContractMethod(web3, addr, i, contractAddr, abi, method, cb) {
	let ValidatorsStorage = attachToContract(web3, abi, contractAddr)
    console.log("attach to oracles contract");
    if (!ValidatorsStorage) {
      return cb();
    }

    ValidatorsStorage.methods[method](addr).call(function(err, res) {
    	cb(i, res);
    })
}