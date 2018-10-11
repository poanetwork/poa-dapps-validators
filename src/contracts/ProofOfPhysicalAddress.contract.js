import helpers from './helpers'
import { constants } from '../constants'

const REGISTER_ADDRESS_EVENT_NAME = 'LogAddressRegistered'

export default class ProofOfPhysicalAddress {
  async init({ web3, netId, addresses }) {
    const { PROOF_OF_PHYSICAL_ADDRESS } = addresses

    const branch = constants.NETWORKS[netId].BRANCH
    if (branch !== 'core') {
      throw new Error(`ProofOfPhysicalAddress contract not deployed on network "${branch}"`)
    }
    const proofOfPhysicalAddressAbi = await helpers.getABI(branch, 'ProofOfPhysicalAddress')
    this.instance = new web3.eth.Contract(proofOfPhysicalAddressAbi, PROOF_OF_PHYSICAL_ADDRESS)

    this.getPhysicalAddressesOfWalletAddress = this.getPhysicalAddressesOfWalletAddress.bind(this)
    this.getAllEvents = this.getAllEvents.bind(this)
    this.getAllAddressRegisteredEvents = this.getAllAddressRegisteredEvents.bind(this)
    this.getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray = this.getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray.bind(
      this
    )
  }

  /**
   * Given a wallet address, return a promise that resolves to an array of physical addresses from PoPA contract or null.
   * If a cached registeredAddressEvents is provided, it will be used to get the corresponding keccakIdentifiers from it.
   * @param {String} walletAddress
   * @param {Object[]} registeredAddressEvents (optional)
   * @return {Promise}
   */
  async getPhysicalAddressesOfWalletAddress(walletAddress, registeredAddressEvents) {
    let result = null
    try {
      if (!registeredAddressEvents) {
        registeredAddressEvents = await this.getAllEvents(REGISTER_ADDRESS_EVENT_NAME)
      }

      let keccakIdentifiers = registeredAddressEvents
        .filter(event => event.returnValues.wallet === walletAddress)
        .map(event => event.returnValues.keccakIdentifier)

      if (keccakIdentifiers.length > 0) {
        let physicalAddresses = await this.getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray(
          walletAddress,
          keccakIdentifiers
        )
        result = physicalAddresses.length > 0 ? physicalAddresses : result
      }
    } catch (e) {
      console.error(`Error in getPhysicalAddressesOfWalletAddress`, e)
    }
    return result
  }

  /**
   * Given a walletAddress and an array of keccakIdentifiers, return a promise that resolves to an array
   * of the corresponding confirmed and unconfirmed physical addresses, or an empty array (unregistered
   * addresses are not included).
   * @param  {String}  walletAddress
   * @param  {String[]}  keccakIdentifierArray
   * @return {Promise}
   */
  async getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray(walletAddress, keccakIdentifierArray) {
    let promises = keccakIdentifierArray.map(keccakIdentifier => {
      return this.instance.methods
        .userAddressByKeccakIdentifier(walletAddress, keccakIdentifier)
        .call()
        .then(async addressStatusTuple => {
          const addressFound = addressStatusTuple[0]
          const addressIndex = addressStatusTuple[1]
          const addressConfirmed = addressStatusTuple[2]
          if (addressFound === false) {
            return null
          } else {
            return {
              isConfirmed: addressConfirmed,
              data: await this.instance.methods.userAddress(walletAddress, addressIndex).call()
            }
          }
        })
        .catch(e => {
          console.error(`Error in getPhysicalAddressesByWalletAddressAndKeccakIdentifierArray`, e)
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

  /**
   * Get all addressRegistered event objects.
   * @return {Promise}
   */
  async getAllAddressRegisteredEvents() {
    return this.getAllEvents(REGISTER_ADDRESS_EVENT_NAME)
  }
}
