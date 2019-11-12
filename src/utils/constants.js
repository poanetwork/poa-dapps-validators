const constants = {}
constants.organization = 'poanetwork'
constants.repoName = 'poa-chain-spec'
constants.addressesSourceFile = 'contracts.json'
constants.ABIsSources = {
  KeysManager: 'KeysManager.abi.json',
  PoaNetworkConsensus: 'PoaNetworkConsensus.abi.json',
  ValidatorMetadata: 'ValidatorMetadata.abi.json',
  ProofOfPhysicalAddress: 'ProofOfPhysicalAddress.abi.json'
}
constants.userDeniedTransactionPattern = 'User denied transaction'
constants.rootPath = '/poa-dapps-validators'
constants.branches = {
  DAI: 'dai',
  CORE: 'core',
  SOKOL: 'sokol',
  KOVAN: 'kovan'
}

constants.navigationData = [
  {
    icon: 'all',
    title: 'All',
    url: constants.rootPath
  },
  {
    icon: 'set',
    title: 'Set Metadata',
    url: `${constants.rootPath}/set`
  },
  {
    icon: 'pending',
    title: 'Pending Changes',
    url: `${constants.rootPath}/pending-changes`
  }
]

constants.NETWORKS = {
  '42': {
    NAME: 'Kovan',
    FULLNAME: 'Kovan Testnet',
    RPC: 'https://kovan.infura.io/v3/1125fe73d87c4e5396678f4e3089b3dd',
    BRANCH: constants.branches.KOVAN,
    SORTORDER: 3
  },
  '77': {
    NAME: 'Sokol',
    FULLNAME: 'Sokol Testnet',
    RPC: 'https://sokol.poa.network',
    BRANCH: constants.branches.SOKOL,
    SORTORDER: 4
  },
  '99': {
    NAME: 'Core',
    FULLNAME: 'POA Core',
    RPC: 'https://core.poa.network',
    BRANCH: constants.branches.CORE,
    SORTORDER: 1
  },
  '100': {
    NAME: 'xDai',
    FULLNAME: 'xDai Stable Chain',
    RPC: 'https://dai.poa.network',
    BRANCH: constants.branches.DAI,
    SORTORDER: 2
  }
}

module.exports = {
  constants
}
