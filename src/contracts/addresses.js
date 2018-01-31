const CORE_ADDRESSES = {
  METADATA_ADDRESS: '0xcBB2912666c7e8023B7ec78B6842702eB26336aC',
  KEYS_MANAGER_ADDRESS: '0x2b1dbc7390a65dc40f7d64d67ea11b4d627dd1bf',
  POA_ADDRESS: '0x83451c8bc04d4ee9745ccc58edfab88037bc48cc',
  MOC: '0xCf260eA317555637C55F70e55dbA8D5ad8414Cb0'
}

function getContractsAddresses(branch) {
    let addr = helpers.addressesURL(branch);
    fetch(addr).then(function(response) { 
        return response.json();
    }).then(function(contracts) {
        switch (branch) {
            case 'core':
                CORE_ADDRESSES = contracts;
                break;
            case 'sokol':
                SOKOL_ADDRESSES = contracts;
                break;
            default:
                CORE_ADDRESSES = contracts;
                break;
        }
    }).catch(function(err) {
        helpers.wrongRepoAlert(addr);
    });
}

getContractsAddresses('core');
getContractsAddresses('sokol');

export default (netId) => {
    switch (netId) {
        case '77':
            return SOKOL_ADDRESSES
        case '99':
            return CORE_ADDRESSES
        default:
            return CORE_ADDRESSES
    }
}
