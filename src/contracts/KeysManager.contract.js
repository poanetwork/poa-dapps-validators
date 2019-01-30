import { constants } from '../utils/constants'
import helpers from './helpers'

export default class KeysManager {
  async init({ web3, netId, addresses }) {
    const { KEYS_MANAGER_ADDRESS } = addresses
    console.log('Keys Manager address ', KEYS_MANAGER_ADDRESS)

    const KeysManagerAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'KeysManager')

    this.instance = new web3.eth.Contract(KeysManagerAbi, KEYS_MANAGER_ADDRESS)
  }
  async isVotingActive(votingKey) {
    return await this.instance.methods.isVotingActive(votingKey).call()
  }
  async miningKeyByVoting(votingKey) {
    return await this.instance.methods.miningKeyByVoting(votingKey).call()
  }
  async getVotingByMining(miningKey) {
    return await this.instance.methods.getVotingByMining(miningKey).call()
  }
}
