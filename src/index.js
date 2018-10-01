import 'react-select/dist/react-select.css'
import AllValidators from './AllValidators'
import App from './App'
import Footer from './Footer'
import Header from './Header'
import KeysManager from './contracts/KeysManager.contract'
import ProofOfPhysicalAddress from './contracts/ProofOfPhysicalAddress.contract'
import Loading from './Loading'
import Metadata from './contracts/Metadata.contract'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import getWeb3, { setWeb3 } from './getWeb3'
import helpers from './helpers'
import networkAddresses from './contracts/addresses'
import registerServiceWorker from './registerServiceWorker'
import { Router, Route } from 'react-router-dom'
import { messages } from './messages'

const history = createBrowserHistory()
const baseRootPath = '/poa-dapps-validators'
const navigationData = [
  {
    icon: 'link-icon-all',
    title: 'All',
    url: baseRootPath
  },
  {
    icon: 'link-icon-set-metadata',
    title: 'Set Metadata',
    url: `${baseRootPath}/set`
  },
  {
    icon: 'link-icon-pending-changes',
    title: 'Pending Changes',
    url: `${baseRootPath}/pending-changes`
  }
]

class AppMainRouter extends Component {
  constructor(props) {
    super(props)

    history.listen(this.onRouteChange.bind(this))

    this.onSetRender = this.onSetRender.bind(this)
    this.onPendingChangesRender = this.onPendingChangesRender.bind(this)
    this.onAllValidatorsRender = this.onAllValidatorsRender.bind(this)
    this.onConfirmPendingChange = this.onConfirmPendingChange.bind(this)
    this.onFinalize = this.onFinalize.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onNetworkChange = this.onNetworkChange.bind(this)
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this)
    this.getNetIdClass = this.getNetIdClass.bind(this)

    this.state = {
      showSearch: true,
      keysManager: null,
      metadataContract: null,
      poaConsensus: null,
      votingKey: null,
      miningKey: null,
      loading: true,
      searchTerm: '',
      injectedWeb3: true,
      netId: '',
      error: false,
      title: navigationData[0].title,
      showMobileMenu: false
    }
    getWeb3()
      .then(async web3Config => {
        return networkAddresses(web3Config)
      })
      .then(async config => {
        const { web3Config, addresses } = config
        const keysManager = new KeysManager()
        await keysManager.init({
          web3: web3Config.web3Instance,
          netId: web3Config.netId,
          addresses
        })
        const metadataContract = new Metadata()
        await metadataContract.init({
          web3: web3Config.web3Instance,
          netId: web3Config.netId,
          addresses
        })
        let proofOfPhysicalAddressContract = new ProofOfPhysicalAddress()
        try {
          await proofOfPhysicalAddressContract.init({
            web3: web3Config.web3Instance,
            netId: web3Config.netId,
            addresses
          })
        } catch (e) {
          console.error('Error initializing ProofOfPhysicalAddress', e)
          proofOfPhysicalAddressContract = null
        }
        this.setState({
          votingKey: web3Config.defaultAccount,
          miningKey: await keysManager.miningKeyByVoting(web3Config.defaultAccount),
          keysManager,
          metadataContract,
          proofOfPhysicalAddressContract,
          loading: false,
          injectedWeb3: web3Config.injectedWeb3,
          netId: web3Config.netId
        })
      })
      .catch(error => {
        console.error(error.message)
        this.setState({ loading: false, error: true })
        helpers.generateAlert('error', 'Error!', error.message)
      })
  }
  onRouteChange() {
    const setMetadata = baseRootPath + '/set'

    if (history.location.pathname === setMetadata) {
      this.setState({ showSearch: false })

      if (this.state.injectedWeb3 === false) {
        helpers.generateAlert('warning', 'Warning!', 'Metamask was not found')
      }
    } else {
      this.setState({ showSearch: true })
    }
  }
  checkForVotingKey(cb) {
    if (this.state.votingKey && !this.state.loading) {
      return cb()
    }
    helpers.generateAlert('warning', 'Warning!', messages.noMetamaskAccount)
    return ''
  }
  onSetRender() {
    if (!this.state.netId) {
      return ''
    }
    return this.checkForVotingKey(() => {
      return <App web3Config={this.state} viewTitle={navigationData[1]['title']} />
    })
  }
  toggleMobileMenu = () => {
    this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }))
  }

  async _onBtnClick({ event, methodToCall, successMsg }) {
    event.preventDefault()
    this.checkForVotingKey(async () => {
      this.setState({ loading: true })
      const miningKey = event.currentTarget.getAttribute('miningkey')
      try {
        let result = await this.state.metadataContract[methodToCall]({
          miningKeyToConfirm: miningKey,
          senderVotingKey: this.state.votingKey,
          senderMiningKey: this.state.miningKey
        })
        console.log(result)
        this.setState({ loading: false })
        helpers.generateAlert('success', 'Congratulations!', successMsg)
      } catch (error) {
        this.setState({ loading: false })
        console.error(error.message)
        helpers.generateAlert('error', 'Error!', error.message)
      }
    })
  }
  async onConfirmPendingChange(event) {
    await this._onBtnClick({
      event,
      methodToCall: 'confirmPendingChange',
      successMsg: 'You have successfully confirmed the change!'
    })
  }
  async onFinalize(event) {
    await this._onBtnClick({
      event,
      methodToCall: 'finalize',
      successMsg: 'You have successfully finalized the change!'
    })
  }
  onPendingChangesRender() {
    return this.state.loading || this.state.error ? (
      ''
    ) : (
      <AllValidators
        ref="AllValidatorsRef"
        methodToCall="getAllPendingChanges"
        searchTerm={this.state.searchTerm}
        web3Config={this.state}
        viewTitle={navigationData[2]['title']}
      >
        <button onClick={this.onFinalize} className="create-keys-button finalize">
          Finalize
        </button>
        <button onClick={this.onConfirmPendingChange} className="create-keys-button">
          Confirm
        </button>
      </AllValidators>
    )
  }
  onAllValidatorsRender() {
    return this.state.loading || this.state.error ? (
      ''
    ) : (
      <AllValidators
        searchTerm={this.state.searchTerm}
        methodToCall="getAllValidatorsData"
        web3Config={this.state}
        viewTitle={navigationData[0]['title']}
      />
    )
  }
  getNetIdClass() {
    const netId = this.state.netId
    return netId === '77' || netId === '79' ? 'sokol' : ''
  }
  onSearch(term) {
    this.setState({ searchTerm: term.target.value.toLowerCase() })
  }
  async onNetworkChange(e) {
    const netId = e.value
    const web3 = setWeb3(netId)

    networkAddresses({ netId }).then(async config => {
      const { addresses } = config
      const keysManager = new KeysManager()

      await keysManager.init({
        web3,
        netId,
        addresses
      })
      const metadataContract = new Metadata()
      await metadataContract.init({
        web3,
        netId,
        addresses
      })
      this.setState({ netId: e.value, keysManager, metadataContract })
    })
  }
  render() {
    console.log('v2.09')

    const search = this.state.showSearch ? (
      <div className={`search-container ${this.getNetIdClass()}`}>
        <div className="container">
          <input type="search" className="search-input" onChange={this.onSearch} placeholder="Search..." />
        </div>
      </div>
    ) : (
      ''
    )

    const loading = this.state.loading ? <Loading netId={this.state.netId} /> : ''

    return (
      <Router history={history}>
        <section className={`content ${this.state.showMobileMenu ? 'content-menu-open' : ''}`}>
          {loading}
          <Header
            baseRootPath={baseRootPath}
            injectedWeb3={this.state.injectedWeb3}
            navigationData={navigationData}
            netId={this.state.netId}
            onChange={this.onNetworkChange}
            onMenuToggle={this.toggleMobileMenu}
            showMobileMenu={this.state.showMobileMenu}
          />
          {search}
          <div
            className={`app-container ${
              this.state.showMobileMenu ? 'app-container-open-mobile-menu' : ''
            } ${this.getNetIdClass()}`}
          >
            <Route exact path="/" render={this.onAllValidatorsRender} web3Config={this.state} />
            <Route exact path={`${baseRootPath}/`} render={this.onAllValidatorsRender} web3Config={this.state} />
            <Route path={`${baseRootPath}/pending-changes`} render={this.onPendingChangesRender} />
            <Route path={`${baseRootPath}/set`} render={this.onSetRender} />
          </div>
          <Footer netId={this.state.netId} />
        </section>
      </Router>
    )
  }
}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'))
registerServiceWorker()
