import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import stackedBarChart from 'britecharts/dist/umd/stackedBar.min';
import { tooltip } from 'britecharts';
import colors from './helpers/color';
import { StackedBarDataBuilder } from './fixtures/stackedBarDataBuilder';
import colorSelectorHelper from './helpers/colorSelector';

require('./helpers/resizeHelper');


let redrawCharts;

function createStackedBarChartWithTooltip(optionalColorSchema) {
    let stackedBar = stackedBarChart(),
        chartTooltip = tooltip(),
        testDataSet = new StackedBarDataBuilder(),
        container = select('.js-stacked-bar-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = testDataSet.with3Sources().build();

        // StackedAreChart Setup and start
        stackedBar
            .tooltipThreshold(600)
            .width(containerWidth)
            .grid('horizontal')
            .isAnimated(true)
            .stackLabel('stack')
            .nameLabel('date')
            .valueLabel('views')
            .betweenBarsPadding(0.3)
            .on('customMouseOver', function() {
                chartTooltip.show();
            })
            .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
                chartTooltip.update(dataPoint, topicColorMap, x, y);
            })
            .on('customMouseOut', function() {
                chartTooltip.hide();
            });

        if (optionalColorSchema) {
            stackedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(stackedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .dateLabel('key')
            .nameLabel('stack')
            .title('Tooltip title');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = select('.js-stacked-bar-chart-tooltip-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);

        select('#button').on('click', function() {
                stackedBar.exportChart('stacked-bar.png', 'Britecharts Stacked Bar');
        });
    }
}

function createHorizontalStackedBarChart(optionalColorSchema) {
    let stackedBar = stackedBarChart(),
        chartTooltip = tooltip(),
        testDataSet = new StackedBarDataBuilder(),
        container = select('.js-stacked-bar-chart-fixed-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = testDataSet.with3Sources().build();

        // StackedAreChart Setup and start
        stackedBar
            .isHorizontal(true)
            .tooltipThreshold(600)
            .grid('vertical')
            .width(containerWidth)
            .isAnimated(true)
            .margin({
                left: 100,
                top: 40,
                right: 30,
                bottom: 20
            })
            .nameLabel('date')
            .valueLabel('views')
            .stackLabel('stack')
            .colorSchema(colors.colorSchemas.teal.reverse())
            .on('customMouseOver', function() {
                chartTooltip.show();
            })
            .on('customMouseMove', function(dataPoint, topicColorMap, x, y) {
                chartTooltip.update(dataPoint, topicColorMap, x, y);
            })
            .on('customMouseOut', function() {
                chartTooltip.hide();
            });

        if (optionalColorSchema) {
            stackedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(stackedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .dateLabel('key')
            .nameLabel('stack')
            .title('Tooltip Title');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = select('.js-stacked-bar-chart-fixed-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);
    }
}

const BriteStackedBar = (color) => {
  if (select('.js-stacked-bar-chart-tooltip-container').node()){
      // Chart creation
      createStackedBarChartWithTooltip(color);
      createHorizontalStackedBarChart(color);

      // For getting a responsive behavior on our chart,
      // we'll need to listen to the window resize event
      redrawCharts = function(){
          selectAll('.stacked-bar').remove();

          createStackedBarChartWithTooltip(color);
          createHorizontalStackedBarChart(color);
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);

      // Color schema selector
      colorSelectorHelper.createColorSelector('.js-color-selector-container', '.stacked-bar', createStackedBarChartWithTooltip);
  }
}

export default class LineChart extends React.Component {
  componentDidMount() {
    new BriteStackedBar(this.props.color)
  }

  render() {
    return (
      <div className="container" id="line" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-12">
            <h2 className="tutorial__heading">Stacked Bar Chart with Tooltip</h2>
            <div className="britechart js-stacked-bar-chart-tooltip-container card--chart"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h2 className="tutorial__heading">Horizontal Stacked Bar Chart</h2>
            <div className="britechart js-stacked-bar-chart-fixed-container card--chart"></div>
          </div>
        </div>
      </div>
    )
  }
}
