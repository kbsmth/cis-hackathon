/* eslint-disable import/no-named-as-default */
import { NavLink, Route, Switch } from "react-router-dom";

import AboutPage from "./AboutPage";
import FuelSavingsPage from "./containers/FuelSavingsPage";
import Trend from "./Trend";
import RadialChartGraph from "./containers/RadialChartGraph";
import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import PropTypes from "prop-types";
import React from "react";
import { hot } from "react-hot-loader";
import _ from 'lodash';
import brain from '../styles/brain.svg';
import voicea from '../styles/voicea.png';
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  state = {
    data: null
  }

  componentDidMount() {
    fetch('https://e42643b2.ngrok.io/api/v1/sentiment/1')
    .then(response => response.json())
    .then(data => {
      this.setState({ data: _.takeRight(data.items, 300) })
    }
    );
  }

  render() {
    return (
      <div>
        <div style={{ height: '119px', display: 'flex', justifyContent: 'start', alignItems: 'center', borderBottom: '1px solid rgb(230, 232, 232)', padding: '0 40px'}}>
          <div>
            <img src={brain} style={{ height: '57px', width: '57px'}}></img>
          </div>
          <div style={{ fontSize: '32px', fontFamily: 'CiscoSans', marginLeft: '21px', color: 'color: rgb(23, 27, 31)' }}>Smart Bank</div>
        </div>
        <div style={{ margin: '33px 48px', display: 'flex', flexFlow: 'row nowrap' }}>
          <div style={{width: '50%'}}>
            <div style={{ fontSize: '20px', fontFamily: 'CiscoSans', color: 'color: rgb(83, 87, 89)' }}>Virtual Client Meeting: Jose Bogarin</div>
            <div style={{ fontSize: '16px', fontFamily: 'CiscoSans', color: 'color: rgb(23, 27, 31)' }}>September 19, 2019</div>
            <div style={{ marginTop: '40px', fontSize: '20px', fontWeight: 500,  fontFamily: 'CiscoSans', color: 'color: rgb(23, 27, 31)' }}>Cognitive Sentiment Report</div>
            <div style={{ width: '100%', height: '68px' }}>
              <Trend data={this.state.data} />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '50px'}}>
              <RadialChartGraph/>
            </div>
          </div>
          <div style={{width: '50%'}}>
            <img src={voicea} height='829px' width='505px'></img>
          </div>
        </div>
        <Switch>
          <Route exact path="/" component={HomePage} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default hot(module)(App);
