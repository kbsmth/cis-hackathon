import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import { bar, miniTooltip } from 'britecharts';
import colors from './helpers/color';

import { BarDataBuilder } from './fixtures/barDataBuilder';

const aTestDataSet = () => new BarDataBuilder();

require('./helpers/resizeHelper');

function createSimpleBarChart(optionalColorSchema) {
  let barChart = bar(),
    barContainer = select('.js-bar-chart-container'),
    containerWidth = barContainer.node()
      ? barContainer.node().getBoundingClientRect().width
      : false,
    dataset;

  if (containerWidth) {
    dataset = aTestDataSet()
      .withLettersFrequency()
      .build();

    barChart
      .width(containerWidth)
      .hasPercentage(true)
      .enableLabels(true)
      .labelsNumberFormat('.0%')
      .height(300);

    if (optionalColorSchema) {
      barChart.colorSchema(optionalColorSchema);
    }

    barContainer.datum(dataset).call(barChart);
  }
}

function createHorizontalBarChart(optionalColorSchema) {
  let barChart = bar(),
    tooltip = miniTooltip(),
    barContainer = select('.js-horizontal-bar-chart-container'),
    containerWidth = barContainer.node()
      ? barContainer.node().getBoundingClientRect().width
      : false,
    tooltipContainer,
    dataset;

  if (containerWidth) {
    dataset = aTestDataSet()
      .withColors()
      .build();

    barChart
      .isHorizontal(true)
      .isAnimated(true)
      .margin({
        left: 120,
        right: 20,
        top: 20,
        bottom: 30
      })
      .colorSchema(colors.colorSchemas.britecharts)
      .width(containerWidth)
      .yAxisPaddingBetweenChart(30)
      .height(300)
      .percentageAxisToMaxRatio(1.3)
      .on('customMouseOver', tooltip.show)
      .on('customMouseMove', tooltip.update)
      .on('customMouseOut', tooltip.hide);

    if (optionalColorSchema) {
      barChart.colorSchema(optionalColorSchema);
    }

    barContainer.datum(dataset).call(barChart);

    tooltipContainer = select(
      '.js-horizontal-bar-chart-container .bar-chart .metadata-group'
    );
    tooltipContainer.datum([]).call(tooltip);
  }
}

function createBarChartWithTooltip(optionalColorSchema) {
  let barChart = bar(),
    tooltip = miniTooltip(),
    barContainer = select('.js-bar-chart-tooltip-container'),
    containerWidth = barContainer.node()
      ? barContainer.node().getBoundingClientRect().width
      : false,
    tooltipContainer,
    dataset;

  if (containerWidth) {
    select('.js-download-button').on('click', function() {
      barChart.exportChart('barchart.png', 'Britecharts Bar Chart');
    });

    dataset = aTestDataSet()
      .withLettersFrequency()
      .build();

    barChart
      .width(containerWidth)
      .height(300)
      .isAnimated(true)
      .on('customMouseOver', tooltip.show)
      .on('customMouseMove', tooltip.update)
      .on('customMouseOut', tooltip.hide);

    if (optionalColorSchema) {
      barChart.colorSchema(optionalColorSchema);
    }

    barContainer.datum(dataset).call(barChart);

    tooltip.numberFormat('.2%');

    tooltipContainer = select('.bar-chart .metadata-group');
    tooltipContainer.datum([]).call(tooltip);
  }
}

function createLoadingState() {
  let barChart = bar(),
    barContainer = select('.js-loading-container'),
    containerWidth = barContainer.node()
      ? barContainer.node().getBoundingClientRect().width
      : false,
    dataset = null;

  if (containerWidth) {
    barContainer.html(barChart.loadingState());
  }
}

const BriteBar = (color) => {
  // Show charts if container available
  if (select('.js-bar-chart-tooltip-container').node()) {
    createBarChartWithTooltip(color);
    createHorizontalBarChart(color);
    createSimpleBarChart(color);
    createLoadingState(color);

    let redrawCharts = function() {
      selectAll('.bar-chart').remove();
      createBarChartWithTooltip(color);
      createHorizontalBarChart(color);
      createSimpleBarChart(color);
      createLoadingState(color);
    };

    // Redraw charts on window resize
    PubSub.subscribe('resize', redrawCharts);
  }
};

export default class Bar extends React.Component {
  componentDidMount() {
    new BriteBar(this.props.color);
  }

  render() {
    return (
      <div className="container" id="bar" style={{ width: '80%', margin: '0 auto' }}>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2 className="tutorial__heading">
                Bar Chart with Tooltip and Labels
              </h2>
              <div className="js-bar-chart-tooltip-container bar-chart-tooltip-container card--chart"></div>
            </article>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2 className="tutorial__heading">Horizontal Bar Chart</h2>
              <div className="js-horizontal-bar-chart-container card--chart"></div>
            </article>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2 className="tutorial__heading">
                Simple Bar Chart with labels
              </h2>
              <div className="js-bar-chart-container card--chart"></div>
            </article>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <article>
              <a name="loading-state"></a>
              <h2 className="tutorial__heading">Loading State</h2>
              <div className="js-loading-container"></div>
            </article>
          </div>
        </div>
      </div>
    );
  }
}
