import KeysManagerAbi from './keysManager.abi.json'
import Web3 from 'web3';

const KEYS_MANAGER_ADDRESS = '0xfc90125492e58dbfe80c0bfb6a2a759c4f703ca8';
export default class KeysManager {
  constructor(){
    if(window.web3.currentProvider){
      let web3_10 = new Web3(window.web3.currentProvider);
      this.keysInstance = new web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS);
    }
  }
  async isVotingActive(votingKey) {
    return await this.keysInstance.methods.isVotingActive(votingKey).call();
  }  
}