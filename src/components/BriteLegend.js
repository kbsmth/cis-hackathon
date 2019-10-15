import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import { donut, legend } from 'britecharts';
import { DonutDataBuilder } from './fixtures/donutChartDataBuilder';
import colorSelectorHelper from './helpers/colorSelector';

require('./helpers/resizeHelper');

const dataset = new DonutDataBuilder()
        .withFivePlusOther().build();
const datasetWithThreeItems = new DonutDataBuilder()
        .withThreeCategories()
        .build();
let redrawCharts;

function createDonutChart(optionalColorSchema) {
    let legendChart = getLegendChart(dataset, optionalColorSchema),
        donutChart = donut(),
        donutContainer = select('.js-donut-chart-container'),
        containerWidth = select('.js-donut-chart-container').node().getBoundingClientRect().width;

    if (containerWidth) {
        donutChart
            .isAnimated(true)
            .width(containerWidth)
            .height(containerWidth)
            .externalRadius(containerWidth/2.5)
            .internalRadius(containerWidth/5)
            .on('customMouseOver', function(data) {
                legendChart.highlight(data.data.id);
            })
            .on('customMouseOut', function() {
                legendChart.clearHighlight();
            });

        if (optionalColorSchema) {
            donutChart.colorSchema(optionalColorSchema);
        }

        donutContainer.datum(dataset).call(donutChart);

        select('#button').on('click', function() {
            donutChart.exportChart('donut.png', 'Britecharts Donut Chart');
        });
    }
}

function getLegendChart(dataset, optionalColorSchema) {
    let legendChart = legend(),
        legendContainer = select('.js-legend-chart-container'),
        containerWidth = legendContainer.node() ? legendContainer.node().getBoundingClientRect().width : false;

    if (containerWidth) {
        select('.js-legend-chart-container .britechart-legend').remove();

        legendChart
            .height(containerWidth / 3)
            .width(containerWidth / 2)
            .numberFormat('s');

        if (optionalColorSchema) {
            legendChart.colorSchema(optionalColorSchema);
        }

        legendContainer.datum(dataset).call(legendChart);

        return legendChart;
    }
}

function createSmallDonutChart(optionalColorSchema) {
    let donutChart = donut(),
        donutContainer = select('.js-small-donut-chart-container'),
        containerWidth = donutContainer.node() ? donutContainer.node().getBoundingClientRect().width : false,
        legendChart = getInlineLegendChart(datasetWithThreeItems);

    if (containerWidth) {
        donutChart
            .width(containerWidth)
            .height(containerWidth/1.8)
            .externalRadius(containerWidth/5)
            .internalRadius(containerWidth/10)
            .on('customMouseOver', function(data) {
                legendChart.highlight(data.data.id);
            })
            .on('customMouseOut', function() {
                legendChart.clearHighlight();
            });

        if (optionalColorSchema) {
          donutChart.colorSchema(optionalColorSchema);
        }

        donutContainer.datum(datasetWithThreeItems).call(donutChart);
    }
}

function getInlineLegendChart(dataset, optionalColorSchema) {
    let legendChart = legend(),
        legendContainer = select('.js-inline-legend-chart-container'),
        containerWidth = legendContainer.node() ? legendContainer.node().getBoundingClientRect().width : false;

    if (containerWidth) {
        select('.js-inline-legend-chart-container .britechart-legend').remove();

        legendChart
            .isHorizontal(true)
            .width(containerWidth*0.6)
            .markerSize(8)
            .height(40)

        if (optionalColorSchema) {
            legendChart.colorSchema(optionalColorSchema);
        }

        legendContainer.datum(dataset).call(legendChart);

        return legendChart;
    }
}

const BriteLegend = (color) => {
  // Show charts if container available
  if (select('.js-legend-chart-container').node()) {
      createDonutChart(color);
      createSmallDonutChart(color);

      redrawCharts = function(){
          selectAll('.donut-chart').remove();

          createDonutChart(color);
          createSmallDonutChart(color);
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);

      // Color schema selector
      colorSelectorHelper.createColorSelector('.js-color-selector-container', '.donut-chart', createDonutChart);
  }
}


export default class Legend extends React.Component {
  componentDidMount() {
    new BriteLegend(this.props.color)
  }

  render() {
    return (
      <div className="container" id="legend" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2 className="tutorial__heading">Legend with Donut Chart</h2>
              <div className="card--chart">
                <div className="js-donut-chart-container donut-chart-container"></div>
                <div className="js-legend-chart-container legend-chart-container"></div>
              </div>
              <p>Legend chart to use with Donut charts to show definitions of color indicators, text labels, and their corresponding values.</p>
            </article>
          </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <section>
            <article>
              <h2>Small Donut Chart with Inline Legend</h2>
              <div className="js-small-donut-chart-container card--chart"></div>
              <div className="js-inline-legend-chart-container legend-chart-container"></div>
            </article>
          </section>
        </div>
      </div>
    </div>
    )
  }
}
