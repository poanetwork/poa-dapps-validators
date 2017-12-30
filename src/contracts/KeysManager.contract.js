import KeysManagerAbi from './keysManager.abi.json'
import Web3 from 'web3';
import networkAddresses from './addresses';


export default class KeysManager {
  constructor({web3, netId}){
    let web3_10 = new Web3(web3.currentProvider);
    const {KEYS_MANAGER_ADDRESS} = networkAddresses(netId);
    this.keysInstance = new web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);
    console.log('Keys Manager', KEYS_MANAGER_ADDRESS);
  }
  async isVotingActive(votingKey) {
    return await this.keysInstance.methods.isVotingActive(votingKey).call();
  }  
}