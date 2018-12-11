import Web3 from 'web3'
import { netIdByName } from './helpers'
import { constants } from './constants'

let getWeb3 = () => {
  return new Promise(function(resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async function() {
      let web3 = null

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (window.ethereum) {
        web3 = new Web3(window.ethereum)
        console.log('Injected web3 detected.')
        try {
          await window.ethereum.enable()
        } catch (e) {
          reject({ message: 'You have denied access to your accounts' })
          return
        }
      } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider)
        console.log('Injected web3 detected.')
      }

      let errorMsg = null
      let netIdName
      let netId
      let injectedWeb3 = web3 !== null
      let defaultAccount = null

      if (web3) {
        netId = await web3.eth.net.getId()
        console.log('netId', netId)

        if (!(netId in constants.NETWORKS)) {
          netIdName = 'ERROR'
          errorMsg = `You aren't connected to POA Network.
              Please, switch to POA Network and refresh the page.
              Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>Wiki</a> for more info.`
          console.log('This is an unknown network.')
        } else {
          netIdName = constants.NETWORKS[netId].NAME
          console.log(`This is ${netIdName}`)
        }

        const accounts = await web3.eth.getAccounts()

        defaultAccount = accounts[0] || null
      } else {
        // Fallback to localhost if no web3 injection.

        console.log('No web3 instance injected, using Local web3.')
        console.error('Metamask not found')

        if (window.location.host.indexOf('sokol') !== -1) {
          netId = netIdByName('sokol')
        } else if (window.location.host.indexOf('dai') !== -1) {
          netId = netIdByName('dai')
        } else {
          netId = netIdByName('core')
        }

        const network = constants.NETWORKS[netId]

        web3 = new Web3(new Web3.providers.HttpProvider(network.RPC))
        netIdName = network.NAME
      }

      document.title = `${netIdName} - POA Validators DApp`

      if (errorMsg !== null) {
        reject({ message: errorMsg })
        return
      }

      resolve({
        web3Instance: web3,
        netId,
        netIdName,
        injectedWeb3,
        defaultAccount
      })
    })
  })
}

const setWeb3 = netId => {
  const provider = new Web3.providers.HttpProvider(constants.NETWORKS[netId].RPC)
  return new Web3(provider)
}

export default getWeb3

export { setWeb3 }
