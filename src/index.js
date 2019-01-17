import AllValidators from './components/AllValidators'
import App from './App'
import KeysManager from './contracts/KeysManager.contract'
import Metadata from './contracts/Metadata.contract'
import ProofOfPhysicalAddress from './contracts/ProofOfPhysicalAddress.contract'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import getWeb3 from './utils/getWeb3'
import helpers from './utils/helpers'
import networkAddresses from './contracts/addresses'
import registerServiceWorker from './utils/registerServiceWorker'
import { BaseLoader } from './components/BaseLoader'
import { ButtonConfirm } from './components/ButtonConfirm'
import { ButtonFinalize } from './components/ButtonFinalize'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Router, Route, Redirect } from 'react-router-dom'
import { SearchBar } from './components/SearchBar'
import { constants } from './utils/constants'
import { getNetworkBranch } from './utils/utils'
import { messages } from './utils/messages'

const history = createBrowserHistory()
const baseRootPath = '/poa-dapps-validators'
const setMetadataPath = `${baseRootPath}/set`
const pendingChangesPath = `${baseRootPath}/pending-changes`

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
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this)

    this.state = {
      showSearch: history.location.pathname !== setMetadataPath,
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
      showMobileMenu: false
    }
    getWeb3()
      .then(async web3Config => {
        return networkAddresses(web3Config)
      })
      .then(async config => {
        const { web3Config, addresses } = config
        await this.initContracts({
          web3: web3Config.web3Instance,
          netId: web3Config.netId,
          addresses
        })
        this.setState({
          votingKey: web3Config.defaultAccount,
          miningKey: await this.state.keysManager.miningKeyByVoting(web3Config.defaultAccount),
          injectedWeb3: web3Config.injectedWeb3
        })
      })
      .catch(error => {
        console.error(error.message)
        this.setState({ loading: false, error: true })
        helpers.generateAlert('error', 'Error!', error.message)
      })
  }
  async initContracts({ web3, netId, addresses }) {
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
    let proofOfPhysicalAddressContract = new ProofOfPhysicalAddress()
    try {
      await proofOfPhysicalAddressContract.init({
        web3,
        netId,
        addresses
      })
    } catch (e) {
      console.error('Error initializing ProofOfPhysicalAddress', e)
      proofOfPhysicalAddressContract = null
    }
    this.setState({
      keysManager,
      metadataContract,
      proofOfPhysicalAddressContract,
      loading: false,
      netId
    })
  }
  onRouteChange() {
    if (history.location.pathname === setMetadataPath) {
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
    const networkBranch = this.getValidatorsNetworkBranch()

    return this.state.loading || this.state.error ? null : (
      <AllValidators
        methodToCall="getAllPendingChanges"
        networkBranch={networkBranch}
        ref="AllValidatorsRef"
        searchTerm={this.state.searchTerm}
        viewTitle={constants.navigationData[2].title}
        web3Config={this.state}
      >
        <ButtonFinalize networkBranch={networkBranch} onClick={this.onFinalize} />
        <ButtonConfirm networkBranch={networkBranch} onClick={this.onConfirmPendingChange} />
      </AllValidators>
    )
  }
  onAllValidatorsRender() {
    const networkBranch = this.getValidatorsNetworkBranch()

    return this.state.loading || this.state.error ? null : (
      <AllValidators
        networkBranch={networkBranch}
        methodToCall="getAllValidatorsData"
        searchTerm={this.state.searchTerm}
        viewTitle={constants.navigationData[0].title}
        web3Config={this.state}
      />
    )
  }
  onSearch(term) {
    this.setState({ searchTerm: term.target.value })
  }
  getValidatorsNetworkBranch() {
    return this.state.netId ? getNetworkBranch(this.state.netId) : null
  }
  onSetRender() {
    const networkBranch = this.getValidatorsNetworkBranch()

    return this.state.loading || !this.state.votingKey ? null : (
      <App web3Config={this.state} networkBranch={networkBranch} />
    )
  }

  render() {
    const networkBranch = this.getValidatorsNetworkBranch()

    return networkBranch ? (
      <Router history={history}>
        <div
          className={`lo-AppMainRouter ${!this.state.showSearch ? 'lo-AppMainRouter-no-search-bar' : ''} ${
            this.state.showMobileMenu ? 'lo-AppMainRouter-menu-open' : ''
          }`}
        >
          <Header
            baseRootPath={baseRootPath}
            networkBranch={networkBranch}
            onMenuToggle={this.toggleMobileMenu}
            showMobileMenu={this.state.showMobileMenu}
          />
          {this.state.showSearch ? <SearchBar networkBranch={networkBranch} onSearch={this.onSearch} /> : null}
          <section
            className={`lo-AppMainRouter_Content lo-AppMainRouter_Content-${networkBranch} ${
              this.state.showMobileMenu ? 'lo-AppMainRouter_Content-mobile-menu-open' : ''
            }`}
          >
            <Route
              exact
              path={`/`}
              render={props => (
                <Redirect
                  to={{
                    pathname: baseRootPath
                  }}
                />
              )}
            />
            <Route exact path={baseRootPath} render={this.onAllValidatorsRender} web3Config={this.state} />
            <Route exact path={pendingChangesPath} render={this.onPendingChangesRender} />
            <Route exact path={setMetadataPath} render={this.onSetRender} />
          </section>
          <Footer baseRootPath={baseRootPath} networkBranch={networkBranch} />
        </div>
      </Router>
    ) : (
      <BaseLoader />
    )
  }
}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'))
registerServiceWorker()
