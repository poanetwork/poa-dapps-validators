
module.exports = (netId) => {
  switch (netId){
    case '77':
      return {
        METADATA_ADDRESS: '0xce9ff1123223d13672cce06dd073d3749764daa6',
        KEYS_MANAGER_ADDRESS: '0x88a34124bfffa27ef3e052c8dd2908e212643771',
        POA_ADDRESS: '0x8bf38d4764929064f2d4d3a56520a76ab3df415b',
        MOC: '0xe8ddc5c7a2d2f0d7a9798459c0104fdf5e987aca'
      }
      case '99':
      return {
        METADATA_ADDRESS: '0xcBB2912666c7e8023B7ec78B6842702eB26336aC',
        KEYS_MANAGER_ADDRESS: '0xfc90125492e58dbfe80c0bfb6a2a759c4f703ca8',
        POA_ADDRESS: '0x8bf38d4764929064f2d4d3a56520a76ab3df415b',
        MOC: '0xCf260eA317555637C55F70e55dbA8D5ad8414Cb0'
      }
    default:
      return {
        METADATA_ADDRESS: '0xcBB2912666c7e8023B7ec78B6842702eB26336aC',
        KEYS_MANAGER_ADDRESS: '0xfc90125492e58dbfe80c0bfb6a2a759c4f703ca8',
        POA_ADDRESS: '0x8bf38d4764929064f2d4d3a56520a76ab3df415b',
        MOC: '0xCf260eA317555637C55F70e55dbA8D5ad8414Cb0'
      }
  }
}