/* eslint-disable import/no-named-as-default */
import { NavLink, Redirect, Route, Switch } from "react-router-dom";

import BriteBar from "./BriteBar";
import BriteBrush from "./BriteBrush";
import BriteBullet from "./BriteBullet";
import BriteDonut from './BriteDonut';
import BriteGroupedBar from './BriteGroupedBar';
import BriteHeatmap from './BriteHeatmap';
import BriteLegend from './BriteLegend';
import BriteLine from "./BriteLine";
import BriteScatter from './BriteScatter';
import BriteSparkline from './BriteSparkline';
import BriteStackedArea from './BriteStackedArea';
import BriteStackedBar from './BriteStackedBar';
import BriteStep from './BriteStep';

import PropTypes from "prop-types";
import React from "react";
import { hot } from "react-hot-loader";
// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

const colorSchema = [
  '#fd0f0d', //blue
  '#6aedc7', //green
  '#6aedc7', //green
  '#39c2c9', //blue
  '#6aedc7', //green
  '#39c2c9', //blue
];

const colorGradient = ['#fd0f0d', '#fd0f0d'];

class App extends React.Component {
  state = {
    data: null
  }

  render() {
    return (
      <div style={{ height: '100vh', width: '100vw' }}>
        <div style={{ height: '119px', display: 'flex', justifyContent: 'start', alignItems: 'center', borderBottom: '1px solid rgb(230, 232, 232)', padding: '0 40px'}}>
          <div style={{ fontSize: '32px', fontFamily: 'CiscoSans', paddingLeft: '21px', color: 'color: rgb(23, 27, 31)' }}>Brite Chart Examples</div>
          <div style={{ width: '100%', display: 'flex', flexFlow: 'row nowrap', justifyContent: 'space-evenly' }}>
            <NavLink to={'/bar'}>Bar</NavLink>
            <NavLink to="/brush">Brush</NavLink>
            <NavLink to="/bullet">Bullet</NavLink>
            <NavLink to="/donut">Donut</NavLink>
            <NavLink to="/groupedbar">Grouped Bar</NavLink>
            <NavLink to="/heatmap">Heatmap</NavLink>
            <NavLink to="/legend">Legend</NavLink>
            <NavLink to="/line">Line</NavLink>
            <NavLink to="/scatter">Scatter</NavLink>
            <NavLink to="/sparkline">Sparkline</NavLink>
            <NavLink to="/stackedarea">Stacked Area</NavLink>
            <NavLink to="/stackedbar">Stacked Bar</NavLink>
            <NavLink to="/step">Step</NavLink>
          </div>
        </div>
        <Switch>
          <Route exact path="/bar" render={() => <BriteBar color={colorSchema} />} />
          <Route exact path="/brush" render={() => <BriteBrush color={colorGradient} />} />
          <Route exact path="/bullet" render={() => <BriteBullet color={colorSchema} />} />
          <Route exact path="/donut" render={() => <BriteDonut color={colorSchema} />} />
          <Route exact path="/groupedbar" render={() => <BriteGroupedBar color={colorSchema} />} />
          <Route exact path="/heatmap" render={() => <BriteHeatmap color={colorSchema} />} />
          <Route exact path="/legend" render={() => <BriteLegend color={colorSchema} />} />
          <Route exact path="/line" render={() => <BriteLine color={colorSchema} />} />
          <Route exact path="/scatter" render={() => <BriteScatter color={colorSchema} />} />
          <Route exact path="/sparkline" render={() => <BriteSparkline color={colorGradient} />} />
          <Route exact path="/stackedarea" render={() => <BriteStackedArea color={colorSchema} />} />
          <Route exact path="/stackedbar" render={() => <BriteStackedBar color={colorSchema} />} />
          <Route exact path="/step" render={() => <BriteStep color={colorSchema} />} />
          <Redirect from='/' to='/bar' />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default hot(module)(App);
