import Web3 from 'web3'

let errorMsgNoMetamaskAccount = `You haven't chosen any account in MetaMask.
Please, choose your initial key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;

let getWeb3 = () => {
  return new Promise(function (resolve, reject) {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', function () {
      var results
      var web3 = window.web3

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        var errorMsg = null;
        web3 = new window.Web3(web3.currentProvider)
        web3.version.getNetwork((err, netId) => {
          let netIdName;
          console.log('netId', netId);
          switch (netId) {
            case "99":
              netIdName = 'Core'
              console.log('This is Core', netId)
              break;
            case "77":
              netIdName = 'Sokol'
              console.log('This is Sokol', netId)
              break;
            default:
              netIdName = 'ERROR'
              errorMsg = `You aren't connected to POA Network. 
                  Please, switch to POA network and refresh the page. 
                  Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`
              console.log('This is an unknown network.', netId)
          }
          document.title = `${netIdName} - POA validators dApp`
          var defaultAccount = web3.eth.defaultAccount || null;
          if(errorMsg !== null){
            reject({message: errorMsg})
          }
          if(defaultAccount === null){
            reject({message: errorMsgNoMetamaskAccount})
          }
          results = {
            web3Instance: web3,
            netIdName,
            netId,
            injectedWeb3: true,
            defaultAccount
          }
          resolve(results)
        })

        console.log('Injected web3 detected.');

      } else {
        // Fallback to localhost if no web3 injection.
        const POA_CORE = { RPC_URL: 'https://core.poa.network', netIdName: 'CORE', netId: '99' }
        const POA_SOKOL = { RPC_URL: 'https://sokol.poa.network', netIdName: 'SOKOL', netId: '77' }
        const network = window.location.host.indexOf('sokol') !== -1 ? POA_SOKOL : POA_CORE

        document.title = `${network.netIdName} - POA validators dApp`
        const provider = new Web3.providers.HttpProvider(network.RPC_URL)
        let web3 = new Web3(provider)

        results = {
          web3Instance: web3,
          netIdName: network.netIdName,
          netId: network.netIdName,
          injectedWeb3: false,
          defaultAccount: null
        }
        resolve(results)
        console.log('No web3 instance injected, using Local web3.');
        console.error('Metamask not found'); 
      }
    })
  })
}

export default getWeb3

