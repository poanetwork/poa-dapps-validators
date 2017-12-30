import poaConsensusAbi from './poaConsensus.abi.json'
import Web3 from 'web3';
import networkAddresses from './addresses';

export default class POAConsensus {
  constructor({web3, netId}){
    let web3_10 = new Web3(web3.currentProvider);
    const {POA_ADDRESS} = networkAddresses(netId);
    this.poaInstance = new web3_10.eth.Contract(poaConsensusAbi, POA_ADDRESS);
    console.log('POA Address ' , POA_ADDRESS)
  }
  async getValidators(){
    return await this.poaInstance.methods.getValidators().call();
  }
}