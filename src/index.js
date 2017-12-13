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
    this.rootPath = '/oracles-dapps-validators'
    history.listen(this.onRouteChange.bind(this));
    this.onSetRender = this.onSetRender.bind(this);
    this.onPendingChangesRender = this.onPendingChangesRender.bind(this);
    this.onAllValidatorsRender = this.onAllValidatorsRender.bind(this)
    this.onConfirmPendingChange = this.onConfirmPendingChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.state = {
      showSearch: true,
      web3loaded: false,
      keysManager :null,
      metadataContract: null,
      poaConsensus: null,
      votingKey :null,
      loading: true,
      searchTerm: ''
    }
    getWeb3().then(async (web3Config) => {
      const keysManager = new KeysManager({
        web3: web3Config.web3Instance
      });
      const metadataContract = new Metadata({
        web3: web3Config.web3Instance
      })
      this.setState({
        votingKey: web3Config.defaultAccount,
        keysManager,
        metadataContract,
        loading: false,
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
    const rootPath = this.rootPath + "/";
    if(history.location.pathname !== rootPath){
      this.setState({showSearch: false})
    } else {
      this.setState({showSearch: true})
    }
  }
  onSubmit(e){
    e.preventDefault();
    switch (history.location.pathname) {
      case "/":
        console.log('main')
        break;
    }
  }
  onSetRender() {
    return this.state.votingKey ? <App web3Config={this.state}/> :  '';
  }
  async onConfirmPendingChange(e) {
    e.preventDefault();
    const miningKey = e.currentTarget.getAttribute('miningkey');
    try{
      let result = await this.state.metadataContract.confirmPendingChange({
        miningKeyToConfirm: miningKey,
        senderVotingKey: this.state.votingKey
      });
      console.log(result);
    } catch(error) {
      console.error(error.message);
      swal({
        icon: 'error',
        title: 'Error',
        content: generateElement(error.message)
      });
    }
  }
  onPendingChangesRender() {
    return this.state.votingKey ? <AllValidators 
      methodToCall="getAllPendingChanges"
      web3Config={this.state}>
        <button onClick={this.onConfirmPendingChange} className="create-keys-button right">Confirm</button>
      </AllValidators> : '';
  }
  onAllValidatorsRender() {
    return this.state.votingKey ? <AllValidators searchTerm={this.state.searchTerm} methodToCall="getAllValidatorsData" web3Config={this.state} /> : '';
  }
  onSearch(term){
    this.setState({searchTerm: term.target.value})
  }
  render(){
    
    console.log('v2.02', this.rootPath)
    const search = this.state.showSearch ? <input type="search" className="search-input" onChange={this.onSearch}/> : ''
    const loading = this.state.loading ? <Loading /> : ''
    return (
      <Router history={history}>
        <section className="content">
        {loading}
        <div className="search">
          <div className="container">
            <div className="nav">
            <NavLink className="nav-i" exact activeClassName="nav-i_active" to={`${this.rootPath}/`}>All</NavLink>
            <NavLink className="nav-i" activeClassName="nav-i_active" to={`${this.rootPath}/set`}>Set metadata</NavLink>
            <NavLink className="nav-i" activeClassName="nav-i_active" to={`${this.rootPath}/pending-changes`}>Pending changes</NavLink>
            </div>
            <form action="" className="search-form" onSubmit={this.onSubmit}>
              {search}
            </form>
          </div>
        </div>
        <Route exact path={`${this.rootPath}/`} render={this.onAllValidatorsRender} onSubmit={this.onSubmit} web3Config={this.state}/>
        <Route path={`${this.rootPath}/set`} render={this.onSetRender} />
        <Route path={`${this.rootPath}/pending-changes`} render={this.onPendingChangesRender} />
        </section>
      </Router>
    )
  }
} 

ReactDOM.render(<AppMainRouter />, document.getElementById('root'));
registerServiceWorker();

