import Web3 from 'web3';
import helpers from "./helpers";

export default class POAConsensus {
  async init({web3, netId, addresses}){
    let web3_10 = new Web3(web3.currentProvider);
    const {POA_ADDRESS} = addresses;
    console.log('POA Address ' , POA_ADDRESS)

    const branch = helpers.getBranch(netId);

    let poaConsensusAbi = await helpers.getABI(branch, 'PoaNetworkConsensus')

    this.poaInstance = new web3_10.eth.Contract(poaConsensusAbi, POA_ADDRESS);
  }
  async getValidators(){
    console.log(this.poaInstance)
    return await this.poaInstance.methods.getValidators().call();
  }
}