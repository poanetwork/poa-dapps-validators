import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import KeysManager from './contracts/KeysManager.contract'
import Metadata from './contracts/Metadata.contract'
import getWeb3 from './getWeb3'
import { setTimeout } from 'timers';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const AppMainRouter = () => (
  <Router>
    <section class="content">
    <div class="search">
      <div class="container">
        <div class="nav">
        <Link className="nav-i nav-i_actual nav-i_active" to="/">Home</Link>
        <Link className="nav-i nav-i_unanswered" to="/about">About</Link>
        <Link className="nav-i nav-i_expired" to="/topics">Topics</Link>
        </div>
        <form action="" className="search-form">
          <input type="text" className="search-input" />
        </form>
      </div>
    </div>
    <Route exact path="/" component={App}/>
    <Route path="/about" component={About}/>
  </section>


  </Router>
)

ReactDOM.render(<AppMainRouter />, document.getElementById('root'));
registerServiceWorker();