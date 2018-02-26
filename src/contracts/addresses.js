import helpers from './helpers'
/*const local = {
  METADATA_ADDRESS: '0xcBB2912666c7e8023B7ec78B6842702eB26336aC',
  KEYS_MANAGER_ADDRESS: '0x2b1dbc7390a65dc40f7d64d67ea11b4d627dd1bf',
  POA_ADDRESS: '0x83451c8bc04d4ee9745ccc58edfab88037bc48cc',
  MOC: '0xCf260eA317555637C55F70e55dbA8D5ad8414Cb0'
}*/

export default (web3Config) => {
    let branch;
    
    switch (web3Config.netId) {
        case '77':
            branch = 'sokol'
            break;
        case '99':
            branch = 'core'
            break;
        default:
            branch = 'core'
            break;
    }
    return new Promise((resolve, reject) => {
        fetch(helpers.addressesURL(branch)).then((response) => { 
            response.json().then((json) => {
                resolve({addresses: json, web3Config});
            })
        }).catch(function(err) {
            let addr = helpers.addressesURL(branch);
            helpers.wrongRepoAlert(addr);
            reject(err);
        });
    })
}
