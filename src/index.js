import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import swal from 'sweetalert';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import KeysManager from './contracts/KeysManager.contract'
import Metadata from './contracts/Metadata.contract'
import getWeb3 from './getWeb3'
import { setTimeout } from 'timers';
import {
  Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom'
import createBrowserHistory from 'history/createBrowserHistory'
import Loading from './Loading'
import AllValidators from './AllValidators'

const history = createBrowserHistory()

function generateElement(msg){
  let errorNode = document.createElement("div");
  errorNode.innerHTML = `<div>
    ${msg}
  </div>`;
  return errorNode;
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
    this.state = {
      showSearch: true,
      web3loaded: false,
      keysManager :null,
      metadataContract: null,
      poaConsensus: null,
      votingKey :null,
      loading: true,
      searchTerm: '',
      injectedWeb3: null
    }
    getWeb3().then(async (web3Config) => {
      const keysManager = new KeysManager({
        web3: web3Config.web3Instance,
        netId: web3Config.netId
      });
      const metadataContract = new Metadata({
        web3: web3Config.web3Instance,
        netId: web3Config.netId
      })
      this.setState({
        votingKey: web3Config.defaultAccount,
        keysManager,
        metadataContract,
        loading: false,
        injectedWeb3: web3Config.injectedWeb3
      })
    }).catch((error) => {
      console.error(error.message);
      this.setState({loading: false})
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
  onSetRender() {
    return this.state.votingKey ? <App web3Config={this.state}/> :  '';
  }
  async _onBtnClick({event, methodToCall, successMsg}){
    event.preventDefault();
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
    return this.state.loading ? '' : <AllValidators 
      methodToCall="getAllPendingChanges"
      searchTerm={this.state.searchTerm}
      web3Config={this.state}>
          <button onClick={this.onFinalize} className="create-keys-button finalize">Finalize</button>
          <button onClick={this.onConfirmPendingChange} className="create-keys-button">Confirm</button>
      </AllValidators>;
  }
  onAllValidatorsRender() {
    return this.state.loading ? '' : <AllValidators searchTerm={this.state.searchTerm} methodToCall="getAllValidatorsData" web3Config={this.state} /> 
  }
  onSearch(term){
    this.setState({searchTerm: term.target.value.toLowerCase()})
  }
  render(){
    console.log('v2.05')
    const search = this.state.showSearch ? <input type="search" className="search-input" onChange={this.onSearch}/> : ''
    const loading = this.state.loading ? <Loading /> : ''
    return (
      <Router history={history}>
        <section className="content">
        {loading}
        <div className="search">
          <div className="container flex-container">
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
        </section>
      </Router>
    )
  }
} 

ReactDOM.render(<AppMainRouter />, document.getElementById('root'));
registerServiceWorker();

