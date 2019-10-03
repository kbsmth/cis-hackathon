/* eslint-disable import/no-named-as-default */
import { NavLink, Route, Switch } from "react-router-dom";

import AboutPage from "./AboutPage";
import FuelSavingsPage from "./containers/FuelSavingsPage";
import Trend from "./Trend";
import RadialChartGraph from "./containers/RadialChartGraph";
import HomePage from "./HomePage";
import lineChart from "./lineChart";
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
    lineChart
    .tooltipThreshold(600)
    .height(300)
    .width(containerWidth)
    .grid('full');

    container.datum(dataset).call(lineChart);
    
    fetch('https://e42643b2.ngrok.io/api/v1/sentiment/1')
    .then(response => response.json())
    .then(data => {
      this.setState({ data: _.takeRight(data.items, 300) })
    }
    );
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <div style={{ height: '119px', display: 'flex', justifyContent: 'start', alignItems: 'center', borderBottom: '1px solid rgb(230, 232, 232)', padding: '0 40px'}}>
          <div>
            <img src={brain} style={{ height: '57px', width: '57px'}}></img>
          </div>
          <div style={{ fontSize: '32px', fontFamily: 'CiscoSans', marginLeft: '21px', color: 'color: rgb(23, 27, 31)' }}>Smart Bank</div>
        </div>
        <div style={{ margin: '33px 48px', display: 'flex', flexFlow: 'row nowrap' }}>
          <div className="container" id="line">
            <div className="row">
              <div className="col-md-8">
                <article>
                  <h2>Line Chart with fixed Aspect Ratio</h2>
                  <div className="js-line-chart-container line-chart-container card--chart" />
                  <div className="js-line-brush-chart-container card--chart" />
                  <p className="js-date-range date-range is-hidden">Selected from <span className="js-start-date"></span> to <span className="js-end-date"></span></p>
                </article>
              </div>
              <div className="col-md-4 sidebar">
                <h3>The code</h3>
                <pre>
                  <code className="language-javascript"></code>
                </pre>
                <h4>Demo Code</h4>
                <p>Read the whole code of this demo <a href="https://github.com/eventbrite/britecharts/blob/master/demos/src/demo-line.js">in github</a></p>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <article>
                  <a name="loading-state"></a>
                  <h2 className="tutorial__heading">Loading State</h2>
                  <div className="js-loading-container"></div>
                </article>
              </div>
            </div>
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
