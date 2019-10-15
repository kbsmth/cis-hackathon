import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import scatterPlot from 'britecharts/dist/umd/scatterPlot.min';
import { miniTooltip } from 'britecharts';
import colorSelectorHelper from './helpers/colorSelector';
import { ScatterPlotDataBuilder } from './fixtures/scatterPlotDataBuilder';

require('./helpers/resizeHelper');

const aTestDataSet = () => new ScatterPlotDataBuilder();

let redrawCharts;

function createScatterPlotWithSingleSource(optionalColorSchema) {
    let scatterChart = scatterPlot();
    let tooltip = miniTooltip().title('Temperature (C)');
    let scatterPlotContainer = select('.js-scatter-plot-chart-tooltip-container');
    let containerWidth = scatterPlotContainer.node() ? scatterPlotContainer.node().getBoundingClientRect().width : false;
    let dataset, tooltipContainer;

    if (containerWidth) {
        // data represents Ice Cream Sales (y) vs Temperature (x)
        dataset = aTestDataSet().withOneSource().build();

        scatterChart
            .aspectRatio(0.7)
            .width(containerWidth)
            .circleOpacity(0.6)
            .hasTrendline(true)
            .grid('horizontal')
            .xAxisLabel('Temperature (C)')
            .margin({
                left: 60,
                bottom: 50
            })
            .yAxisLabel('Ice Cream Sales')
            .yAxisFormat('$')
            .xAxisFormat('.1f')
            .on('customMouseOver', tooltip.show)
            .on('customMouseMove', tooltip.update)
            .on('customMouseOut', tooltip.hide);

        if (optionalColorSchema) {
            scatterChart.colorSchema(optionalColorSchema);
        }

        scatterPlotContainer.datum(dataset).call(scatterChart);

        // tooltip set up
        tooltip.valueLabel('y')
            .nameLabel('x')
            .numberFormat('$');

        tooltipContainer = select('.js-scatter-plot-chart-tooltip-container .scatter-plot .metadata-group');
        tooltipContainer.datum([]).call(tooltip);
    }
}

function createScatterPlotWithIncreasedAreaAndHollowCircles(optionalColorSchema) {
    let scatterChart = scatterPlot();
    let tooltip = miniTooltip();
    let scatterPlotContainer = select('.js-scatter-plot-container-with-hollow-circles');
    let containerWidth = scatterPlotContainer.node() ? scatterPlotContainer.node().getBoundingClientRect().width : false;
    let dataset, tooltipContainer;

    if (containerWidth) {
        dataset = aTestDataSet().withFourNames().build();

        scatterChart
            .width(containerWidth)
            .hasCrossHairs(true)
            .hasHollowCircles(true)
            .margin({
                left: 60,
                bottom: 45
            })
            .maxCircleArea(15)
            .on('customMouseOver', tooltip.show)
            .on('customMouseMove', function (dataPoint, mousePos, chartSize) {
                tooltip.title(dataPoint.name);
                // passing an empty object to not have any data
                // in the tooltip - we want to only show the title
                tooltip.update({}, mousePos, chartSize);
            })
            .on('customMouseOut', tooltip.hide);

            if (optionalColorSchema) {
              scatterChart.colorSchema(optionalColorSchema);
          }

        scatterPlotContainer.datum(dataset).call(scatterChart);

        tooltipContainer = select('.js-scatter-plot-container-with-hollow-circles .scatter-plot .metadata-group');
        tooltipContainer.datum([]).call(tooltip);
    }
}

const BriteScatter = (color) => {
  // Show charts if container available
  if (select('.js-scatter-plot-chart-tooltip-container').node()) {
      createScatterPlotWithSingleSource(color)
      createScatterPlotWithIncreasedAreaAndHollowCircles(color);

      redrawCharts = function() {
          selectAll('.scatter-plot').remove();
          createScatterPlotWithSingleSource(color);
          createScatterPlotWithIncreasedAreaAndHollowCircles(color);
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);

      // Color schema selector
      colorSelectorHelper.createColorSelector('.js-color-selector-container', '.scatter-plot', function (newSchema) {
          createScatterPlotWithSingleSource(newSchema);
      });
  }
}

export default class Scatter extends React.Component {
  componentDidMount() {
    new BriteScatter(this.props.color)
  }

  render() {
    return (
      <div className="container" id="scatterPlot" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2>Scatter Plot with single source and horizontal grid</h2>
              <div className="js-scatter-plot-chart-tooltip-container scatter-plot-container card--chart"></div>
            </article>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <article>
              <h2>Scatter Plot with hollow circles and custom circle area</h2>
              <div className="js-scatter-plot-container-with-hollow-circles scatter-plot-container card--chart"></div>
            </article>
          </div>
        </div>
      </div>
    )
  }
}
