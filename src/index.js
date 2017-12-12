import React, {Component} from 'react';
import ReactDOM from 'react-dom';
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





class AppMainRouter extends Component {
  constructor(props){
    super(props);
    history.listen(this.onRouteChange.bind(this));
    this.onSetRender = this.onSetRender.bind(this)
    this.onAllValidatorsRender = this.onAllValidatorsRender.bind(this)
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      showSearch: true,
      web3loaded: false,
      keysManager :null,
      metadataContract: null,
      poaConsensus: null,
      votingKey :null,
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
      })
    })
  }
  onRouteChange(){
    if(history.location.pathname !== "/"){
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
  onAllValidatorsRender() {
    return this.state.votingKey ? <AllValidators web3Config={this.state} /> : '';
  }
  render(){
    const search = this.state.showSearch ? <input type="text" className="search-input"/> : ''
    const loading = this.state.votingKey ? '' : <Loading />
    return (
      <Router history={history}>
        <section className="content">
        {loading}
        <div className="search">
          <div className="container">
            <div className="nav">
            <NavLink className="nav-i nav-i_actual" exact activeClassName="nav-i_active" to="/">All</NavLink>
            <NavLink className="nav-i nav-i_unanswered" activeClassName="nav-i_active" to="/set">Set metadata</NavLink>
            <NavLink className="nav-i nav-i_expired" activeClassName="nav-i_active" to="/topics">Pending changes</NavLink>
            </div>
            <form action="" className="search-form" onSubmit={this.onSubmit}>
              {search}
            </form>
          </div>
        </div>
        <Route exact path="/" render={this.onAllValidatorsRender} onSubmit={this.onSubmit} web3Config={this.state}/>
        <Route path="/set" render={this.onSetRender} />
        </section>
      </Router>
    )
  }
} 

ReactDOM.render(<AppMainRouter />, document.getElementById('root'));
registerServiceWorker();
