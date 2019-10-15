import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import groupedBarChart from 'britecharts/dist/umd/groupedBar.min';
import { tooltip } from 'britecharts';
import { GroupedBarChartDataBuilder } from './fixtures/groupedBarChartDataBuilder';
import colorSelectorHelper from './helpers/colorSelector';

require('./helpers/resizeHelper');

const aTestDataSet = () => new GroupedBarChartDataBuilder();
let redrawCharts;

function creategroupedBarChartWithTooltip(optionalColorSchema) {
    let groupedBar = groupedBarChart(),
        chartTooltip = tooltip(),
        container = select('.js-grouped-bar-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = aTestDataSet().with3Sources().build();

        // GroupedAreChart Setup and start
        groupedBar
            .tooltipThreshold(600)
            .width(containerWidth)
            .grid('horizontal')
            .isAnimated(true)
            .groupLabel('stack')
            .nameLabel('date')
            .valueLabel('views')
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
            groupedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(groupedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .dateLabel('key')
            .nameLabel('stack')
            .title('Testing tooltip');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = select('.js-grouped-bar-chart-tooltip-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);

        select('#button').on('click', function() {
            groupedBar.exportChart('grouped-bar.png', 'Britecharts Grouped Bar');
        });
    }
}

function createHorizontalgroupedBarChart(optionalColorSchema) {
    let groupedBar = groupedBarChart(),
        chartTooltip = tooltip(),
        container = select('.js-grouped-bar-chart-fixed-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = aTestDataSet().with3Sources().build();

        // StackedAreChart Setup and start
        groupedBar
            .tooltipThreshold(600)
            .grid('vertical')
            .width(containerWidth)
            .isHorizontal(true)
            .isAnimated(true)
            .margin({
                left: 80,
                top: 40,
                right: 30,
                bottom: 20
            })
            .nameLabel('date')
            .valueLabel('views')
            .groupLabel('stack')
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
            groupedBar.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(groupedBar);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .dateLabel('key')
            .nameLabel('stack')
            .title('Tooltip Title');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = select('.js-grouped-bar-chart-fixed-container .metadata-group');
        tooltipContainer.datum([]).call(chartTooltip);
    }
}

const BriteGroupedBar = (color) => {
  if (
      select('.js-grouped-bar-chart-tooltip-container').node()){
      // Chart creation
      creategroupedBarChartWithTooltip(color);
      createHorizontalgroupedBarChart(color);

      // For getting a responsive behavior on our chart,
      // we'll need to listen to the window resize event
      redrawCharts = () => {
          selectAll('.grouped-bar').remove();

          creategroupedBarChartWithTooltip(color);
          createHorizontalgroupedBarChart(color);
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);

      // Color schema selector
      colorSelectorHelper.createColorSelector('.js-color-selector-container', '.grouped-bar', creategroupedBarChartWithTooltip);
  }
}

export default class BrGroupedBar extends React.Component {
  componentDidMount() {
    new BriteGroupedBar(this.props.color)
  }

  render() {
    return (
      <div className="container" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-12">
            <h2 className="tutorial__heading">Grouped Bar Chart with Tooltip</h2>
            <div className="js-grouped-bar-chart-tooltip-container card--chart"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h2 className="tutorial__heading">Horizontal Grouped Bar Chart</h2>
            <div className="js-grouped-bar-chart-fixed-container card--chart"></div>
          </div>
        </div>
      </div>
    )
  }
}

