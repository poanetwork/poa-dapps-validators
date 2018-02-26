import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import KeysManager from './contracts/KeysManager.contract'
import Metadata from './contracts/Metadata.contract'
import getWeb3, {setWeb3} from './getWeb3'
import {
  Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import Loading from './Loading'
import Footer from './Footer';
import AllValidators from './AllValidators'
import Select from 'react-select'
import "react-select/dist/react-select.css";
import networkAddresses from './contracts/addresses';

let errorMsgNoMetamaskAccount = `Your MetaMask is locked.
Please, choose your voting key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;

const history = createBrowserHistory()

function generateElement(msg){
  let errorNode = document.createElement("div");
  errorNode.innerHTML = `<div>
    ${msg}
  </div>`;
  return errorNode;
}

let Header = ({netId, onChange, injectedWeb3}) => {
  let select;
  let headerClassName = netId === '77' ? 'sokol' : '';
  const logoClassName = netId === '77' ? 'header-logo-sokol' : 'header-logo';
  if(!injectedWeb3) {
    select = <Select id="netId"
        value={netId}
        onChange={onChange}
        style={{
          width: '150px',
        }}
        wrapperStyle={{
          width: '150px',
        }}
        clearable={false}
        options={[
          { value: '77', label: 'Network: Sokol' },
          { value: '99', label: 'Network: Core' },
        ]} />
  }
  return (
    <header id="header" className={`header ${headerClassName}`}>
      <div className="container">
          <a href="/poa-dapps-validators" className={logoClassName}></a>
          {select}
      </div>
    </header>
  )
}
class AppMainRouter extends Component {
  constructor(props){
    super(props);
    this.rootPath = '/poa-dapps-validators'
    history.listen(this.onRouteChange.bind(this));
    this.onSetRender = this.onSetRender.bind(this);
    this.onPendingChangesRender = this.onPendingChangesRender.bind(this);
    this.onAllValidatorsRender = this.onAllValidatorsRender.bind(this)
    this.onConfirmPendingChange = this.onConfirmPendingChange.bind(this);
    this.onFinalize = this.onFinalize.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onNetworkChange = this.onNetworkChange.bind(this);
    this.state = {
      showSearch: true,
      web3loaded: false,
      keysManager :null,
      metadataContract: null,
      poaConsensus: null,
      votingKey :null,
      loading: true,
      searchTerm: '',
      injectedWeb3: true,
      netId: '',
      error: false
    }
    getWeb3().then(async (web3Config) => {
      return networkAddresses(web3Config)
    }).then(async (config) => {
      const {web3Config, addresses} = config;
      const keysManager = new KeysManager()
      await keysManager.init({
        web3: web3Config.web3Instance,
        netId: web3Config.netId,
        addresses,
      })
      const metadataContract = new Metadata()
      await metadataContract.init({
        web3: web3Config.web3Instance,
        netId: web3Config.netId,
        addresses,
      })
      this.setState({
        votingKey: web3Config.defaultAccount,
        keysManager,
        metadataContract,
        loading: false,
        injectedWeb3: web3Config.injectedWeb3,
        netId: web3Config.netId,
      })
    }).catch((error) => {
      console.error(error.message);
      this.setState({loading: false, error: true});
      swal({
        icon: 'error',
        title: 'Error',
        content: generateElement(error.message)
      });
    })
  }
  onRouteChange(){
    const setMetadata = this.rootPath + "/set";
    if(history.location.pathname === setMetadata){
      this.setState({showSearch: false})
      if(this.state.injectedWeb3 === false){
        swal({
          icon: 'warning',
          title: 'Warning',
          content: generateElement('Metamask was not found')
        });
      }
    } else {
      this.setState({showSearch: true})
    }
  }
  checkForVotingKey(cb){
    if(this.state.votingKey && !this.state.loading){
      return cb();
    } else {
      swal({
        icon: 'warning',
        title: 'Warning',
        content: generateElement(errorMsgNoMetamaskAccount)
      });
      return ''
    }
  }
  onSetRender() {
    return this.checkForVotingKey(() => {
      return <App web3Config={this.state}/>
    })
  }
  async _onBtnClick({event, methodToCall, successMsg}){
    event.preventDefault();
    this.checkForVotingKey(async () => {
      this.setState({loading: true})
      const miningKey = event.currentTarget.getAttribute('miningkey');
      try{
        let result = await this.state.metadataContract[methodToCall]({
          miningKeyToConfirm: miningKey,
          senderVotingKey: this.state.votingKey
        });
        console.log(result);
        this.setState({loading: false})
        swal("Congratulations!", successMsg, "success");
      } catch(error) {
        this.setState({loading: false})
        console.error(error.message);
        swal({
          icon: 'error',
          title: 'Error',
          content: generateElement(error.message)
        });
      }
    })
  }
  async onConfirmPendingChange(event) {
    await this._onBtnClick({
      event,
      methodToCall: 'confirmPendingChange',
      successMsg: 'You have successfully confirmed the change!'
    });
  }
  async onFinalize(event){
    await this._onBtnClick({
      event,
      methodToCall: 'finalize',
      successMsg: 'You have successfully finalized the change!'
    });
  }
  onPendingChangesRender() {
    return this.state.loading && this.state.error? '' : <AllValidators
      ref="AllValidatorsRef"
      methodToCall="getAllPendingChanges"
      searchTerm={this.state.searchTerm}
      web3Config={this.state}>
          <button onClick={this.onFinalize} className="create-keys-button finalize">Finalize</button>
          <button onClick={this.onConfirmPendingChange} className="create-keys-button">Confirm</button>
      </AllValidators>;
  }
  onAllValidatorsRender() {
    return this.state.loading || this.state.error ? '' : <AllValidators
      searchTerm={this.state.searchTerm}
      methodToCall="getAllValidatorsData"
      web3Config={this.state}
      />
  }
  onSearch(term){
    this.setState({searchTerm: term.target.value.toLowerCase()})
  }
  async onNetworkChange(e){
    const netId = e.value;
    const web3 = setWeb3(netId);
    networkAddresses({netId}).then(async (config) => {
      const {addresses} = config;
      const keysManager = new KeysManager();
      await keysManager.init({
        web3,
        netId,
        addresses
      });
      const metadataContract = new Metadata()
      await metadataContract.init({
        web3,
        netId,
        addresses
      });
      this.setState({netId: e.value, keysManager, metadataContract})
    })
  }
  render(){
    console.log('v2.08')
    const search = this.state.showSearch ? <input type="search" className="search-input" onChange={this.onSearch}/> : ''
    const loading = this.state.loading ? <Loading netId={this.state.netId} /> : ''
    return (
      <Router history={history}>
        <section className="content">
          <Header netId={this.state.netId} onChange={this.onNetworkChange} injectedWeb3={this.state.injectedWeb3} />
        {loading}
        <div className="nav-container">
          <div className="container">
            <div className="nav">
              <NavLink className="nav-i" exact activeClassName="nav-i_active" to={`${this.rootPath}/`}>All</NavLink>
              <NavLink className="nav-i" activeClassName="nav-i_active" to={`${this.rootPath}/set`}>Set metadata</NavLink>
              <NavLink className="nav-i" activeClassName="nav-i_active" to={`${this.rootPath}/pending-changes`}>Pending changes</NavLink>
            </div>
            {search}
          </div>
        </div>
        <Route exact path={`${this.rootPath}/`} render={this.onAllValidatorsRender} web3Config={this.state}/>
        <Route exact path="/" render={this.onAllValidatorsRender} web3Config={this.state}/>
        <Route path={`${this.rootPath}/set`} render={this.onSetRender} />
        <Route path={`${this.rootPath}/pending-changes`} render={this.onPendingChangesRender} />
        <Footer netId={this.state.netId} />
        </section>
      </Router>
    )
  }
}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'));
registerServiceWorker();
