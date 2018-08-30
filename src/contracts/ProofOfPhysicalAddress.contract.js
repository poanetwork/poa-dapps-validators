import Web3 from 'web3'
import helpers from './helpers'

const CONFIRM_ADDRESS_EVENT_NAME = 'LogAddressConfirmed'

export default class ProofOfPhysicalAddress {
  async init({ web3, netId, addresses }) {
    let web3_10 = new Web3(web3.currentProvider)
    const { PROOF_OF_PHYSICAL_ADDRESS } = addresses

    const branch = helpers.getBranch(netId)
    if (branch !== 'core') {
      throw new Error(`ProofOfPhysicalAddress contract not deployed network "${branch}"`)
    }
    let proofOfPhysicalAddressAbi = await helpers.getABI(branch, 'ProofOfPhysicalAddress')
    this.instance = new web3_10.eth.Contract(proofOfPhysicalAddressAbi, PROOF_OF_PHYSICAL_ADDRESS)

    this.getConfirmedAddressesOfWalletAddressArray = this.getConfirmedAddressesOfWalletAddressArray.bind(this)
    this.getAllEvents = this.getAllEvents.bind(this)
    this.getConfirmedAddressesByWalletAddressAndKeccakIdentifierArray = this.getConfirmedAddressesByWalletAddressAndKeccakIdentifierArray.bind(
      this
    )
  }

  /**
   * Given an array of wallet address, return a promise that resolves to an array of result
   * sets of confirmed addresses from PoBA contract.
   * @param {String[]} walletAddressArray
   * @return {Promise}
   */
  async getConfirmedAddressesOfWalletAddressArray(walletAddressArray) {
    let confirmedAddresses = []
    try {
      const confirmAddressEvents = await this.getAllEvents(CONFIRM_ADDRESS_EVENT_NAME)
      const getConfirmedAddressesPromises = walletAddressArray.map(walletAddress => {
        let confirmedAddressByWalletAddress = null
        let keccakIdentifiers = confirmAddressEvents
          .filter(event => event.returnValues.wallet === walletAddress)
          .map(event => event.returnValues.keccakIdentifier)
        if (keccakIdentifiers.length > 0) {
          confirmedAddressByWalletAddress = this.getConfirmedAddressesByWalletAddressAndKeccakIdentifierArray(
            walletAddress,
            keccakIdentifiers
          ).then(physicalAddresses => {
            return physicalAddresses.length > 0 ? physicalAddresses : null
          })
        }
        return Promise.resolve(confirmedAddressByWalletAddress)
      })
      confirmedAddresses = await Promise.all(getConfirmedAddressesPromises)
    } catch (e) {
      console.error(`Error in getConfirmedAddressesOfWalletAddressArray`, e)
    }
    return confirmedAddresses
  }

  /**
   * Given a walletAddress and an array of keccakIdentifiers, return a promise that resolves to an array
   * of the corresponding confirmed physical addresses, or an empty array.
   * @param  {String}  walletAddress
   * @param  {String[]}  keccakIdentifierArray
   * @return {Promise}
   */
  async getConfirmedAddressesByWalletAddressAndKeccakIdentifierArray(walletAddress, keccakIdentifierArray) {
    let promises = keccakIdentifierArray.map(keccakIdentifier => {
      return this.instance.methods
        .userAddressByKeccakIdentifier(walletAddress, keccakIdentifier)
        .call()
        .then(addressStatusTuple => {
          const addressFound = addressStatusTuple[0]
          const addressIndex = addressStatusTuple[1]
          const addressConfirmed = addressStatusTuple[2]
          // If addressIndex === 0, it also means the address was not found
          if (addressFound === false || addressIndex === 0) {
            return null
          } else {
            return addressConfirmed === true
              ? this.instance.methods.userAddress(walletAddress, addressIndex).call()
              : null
          }
        })
        .catch(e => {
          console.error(`Error in getAddressesByWalletAddressAndKeccakIdentifierArray`, e)
          return null
        })
    })
    let physicalAddressArray = await Promise.all(promises)
    return physicalAddressArray.filter(address => address !== null)
  }

  /**
   * Get all event objects, with the given eventName.
   * @param {String} eventName
   * @return {Promise}
   */
  async getAllEvents(eventName) {
    let result = []
    try {
      result = await this.instance.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' })
    } catch (e) {
      console.error(e)
    }
    return result
  }
}
