import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import sparklineChart from 'britecharts/dist/umd/sparkline.min';
import { SparklineDataBuilder } from './fixtures/sparklineDataBuilder';

require('./helpers/resizeHelper');

const aTestDataSet = () => new SparklineDataBuilder();
let redrawCharts;

function createSparklineChart(optionalColorSchema) {
    let sparkline = sparklineChart(),
        containerWidth = select('.js-sparkline-chart-container').node().getBoundingClientRect().width,
        container = select('.js-sparkline-chart-container'),
        dataset;

    select('#button').on('click', function() {
        sparkline.exportChart('sparkline.png', 'Britechart Sparkline Chart');
    });

    dataset = aTestDataSet().with1Source().build();

    // Sparkline Chart Setup and start
    sparkline
        .dateLabel('dateUTC')
        .isAnimated(true)
        .duration(1000)
        .height(containerWidth / 4)
        .width(containerWidth);

      if (optionalColorSchema) {
          sparkline.lineGradient(optionalColorSchema);
      }

    container.datum(dataset.data).call(sparkline);
}

function createLoadingState() {
    let sparkline = sparklineChart(),
        containerWidth = select('.js-loading-container').node().getBoundingClientRect().width,
        container = select('.js-loading-container'),
        dataset = null;

    if (containerWidth) {
        container.html(sparkline.loadingState());
    }
}

const BriteSparkline = (color) => {
  // Show charts if container available
  if (select('.js-sparkline-chart-container').node()){
      createSparklineChart(color);
      createLoadingState();

      redrawCharts = function(){
          selectAll('.sparkline').remove();
          createSparklineChart(color);
          createLoadingState();
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);
  }
}

export default class Sparkline extends React.Component {
  componentDidMount() {
    new BriteSparkline(this.props.color)
  }

  render() {
    return (
      <div className="container" id="sparkline" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2 className="tutorial__heading">Sparkline Chart</h2>
              <div className="js-sparkline-chart-container card--chart"></div>
              <p>This is the sparkline chart used for showing trends in data over time.</p>
              <p>We have included a resize listener to show how the different charts respond to changes on the viewport.</p>
            </article>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <article>
                <h2 className="tutorial__heading">Loading State</h2>
                <div className="js-loading-container card--chart"></div>
            </article>
          </div>
        </div>
      </div>
    )
  }
}
