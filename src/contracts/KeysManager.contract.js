import Web3 from 'web3'
import { constants } from '../constants'
import helpers from './helpers'

export default class KeysManager {
  async init({ web3, netId, addresses }) {
    let web3_10 = new Web3(web3.currentProvider)
    const { KEYS_MANAGER_ADDRESS } = addresses
    console.log('Keys Manager address ', KEYS_MANAGER_ADDRESS)

    let KeysManagerAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'KeysManager')

    this.keysInstance = new web3_10.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS)
  }
  async isVotingActive(votingKey) {
    return await this.keysInstance.methods.isVotingActive(votingKey).call()
  }
  async miningKeyByVoting(votingKey) {
    return await this.keysInstance.methods.miningKeyByVoting(votingKey).call()
  }
  async getVotingByMining(miningKey) {
    return await this.keysInstance.methods.getVotingByMining(miningKey).call()
  }
}
