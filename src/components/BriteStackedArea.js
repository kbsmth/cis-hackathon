import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import stackedAreaChart from 'britecharts/dist/umd/stackedArea.min';
import { tooltip } from 'britecharts';
import { StackedAreaDataBuilder } from './fixtures/stackedAreaDataBuilder';
import colorSelectorHelper from './helpers/colorSelector';

require('./helpers/resizeHelper');


const aTestDataSet = () => new StackedAreaDataBuilder();
const uniq = (arrArg) => arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);

let redrawCharts;

function createStackedAreaChartWithTooltip(optionalColorSchema) {
    let stackedArea = stackedAreaChart(),
        chartTooltip = tooltip(),
        container = select('.js-stacked-area-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = aTestDataSet().with6Sources().build();

        // StackedAreChart Setup and start
        stackedArea
            .isAnimated(true)
            .tooltipThreshold(600)
            .width(containerWidth)
            .dateLabel('dateUTC')
            .valueLabel('views')
            .grid('horizontal')
            .on('customDataEntryClick', function(d, mousePosition) {
                // eslint-disable-next-line no-console
                console.log('Data entry marker clicked', d, mousePosition);
            })
            .on('customMouseOver', chartTooltip.show)
            .on('customMouseMove', function(dataPoint, topicColorMap, dataPointXPosition) {
                chartTooltip.update(dataPoint, topicColorMap, dataPointXPosition);
            })
            .on('customMouseOut', chartTooltip.hide);

        if (optionalColorSchema) {
            stackedArea.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(stackedArea);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .title('Testing tooltip');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = select('.js-stacked-area-chart-tooltip-container .metadata-group .vertical-marker-container');
        tooltipContainer.datum([]).call(chartTooltip);

        select('#button').on('click', function() {
            stackedArea.exportChart('stacked-area.png', 'Britecharts Stacked Area');
        });
    }
}

function createStackedAreaChartWithFixedAspectRatio(optionalColorSchema) {
    let stackedArea = stackedAreaChart(),
        chartTooltip = tooltip(),
        container = select('.js-stacked-area-chart-fixed-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = aTestDataSet().with3Sources().build();

        // StackedAreChart Setup and start
        stackedArea
            .tooltipThreshold(600)
            .aspectRatio(0.5)
            .grid('full')
            .xAxisFormat('custom')
            .xAxisCustomFormat('%Y/%m/%d')
            .xTicks(2)
            .width(containerWidth)
            .dateLabel('date')
            .valueLabel('views')
            .on('customMouseOver', chartTooltip.show)
            .on('customMouseMove', chartTooltip.update)
            .on('customMouseOut', chartTooltip.hide);

        if (optionalColorSchema) {
            stackedArea.colorSchema(optionalColorSchema);
        }

        container.datum(dataset.data).call(stackedArea);

        // Tooltip Setup and start
        chartTooltip
            .topicLabel('values')
            .title('Tooltip Title');

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = select('.js-stacked-area-chart-fixed-container .metadata-group .vertical-marker-container');
        tooltipContainer.datum([]).call(chartTooltip);
    }
}

function createStackedAreaChartWithSyncedTooltip(optionalColorSchema) {
    let stackedArea = stackedAreaChart(),
        chartTooltip = tooltip(),
        container = select('.js-stacked-area-chart-tooltip-bis-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        dataset = aTestDataSet().withSalesChannelData().build();

        // StackedAreChart Setup and start
        stackedArea
            .isAnimated(true)
            .tooltipThreshold(600)
            .width(containerWidth)
            .grid('horizontal')
            .topicsOrder([
                'Other',
                'Sunny',
                'Blazing',
                'Glittering',
                'Flashing',
                'Shining'
            ])
            .on('customMouseOver', chartTooltip.show)
            .on('customMouseMove', chartTooltip.update)
            .on('customMouseOut', chartTooltip.hide);

            if (optionalColorSchema) {
              stackedArea.colorSchema(optionalColorSchema);
          }

        container.datum(dataset.data).call(stackedArea);

        // Tooltip Setup and start
        chartTooltip
            .topicsOrder([
                'Other',
                'Sunny',
                'Blazing',
                'Glittering',
                'Flashing',
                'Shining'
            ])
            .topicLabel('values')
            .title('Testing tooltip')
            .topicsOrder(uniq(dataset.data.map((d) => d.name)));

        // Note that if the viewport width is less than the tooltipThreshold value,
        // this container won't exist, and the tooltip won't show up
        tooltipContainer = select('.js-stacked-area-chart-tooltip-bis-container .metadata-group .vertical-marker-container');
        tooltipContainer.datum([]).call(chartTooltip);
    }
}

function createLoadingState() {
    let stackedArea = stackedAreaChart(),
        stackedAreaContainer = select('.js-loading-container'),
        containerWidth = stackedAreaContainer.node() ? stackedAreaContainer.node().getBoundingClientRect().width : false,
        dataset = null;

    if (containerWidth) {
        stackedAreaContainer.html(stackedArea.loadingState());
    }
}

const BriteStackedArea = (color) => {
  if (select('.js-stacked-area-chart-tooltip-container').node()){
      // Chart creation
      createStackedAreaChartWithTooltip(color);
      createStackedAreaChartWithFixedAspectRatio(color);
      createStackedAreaChartWithSyncedTooltip(color);
      createLoadingState(color);

      // For getting a responsive behavior on our chart,
      // we'll need to listen to the window resize event
      redrawCharts = function(){
          selectAll('.stacked-area').remove();
          createStackedAreaChartWithTooltip(color);
          createStackedAreaChartWithFixedAspectRatio(color);
          createStackedAreaChartWithSyncedTooltip(color);
          createLoadingState();
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);

      // Color schema selector
      colorSelectorHelper.createColorSelector('.js-color-selector-container', '.stacked-area', createStackedAreaChartWithTooltip);
  }
}


export default class StackedArea extends React.Component {
  componentDidMount() {
    new BriteStackedArea(this.props.color)
  }

  render() {
    return (
      <div className="container" id="stacked-area" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-12">
            <h2 className="tutorial__heading">Stacked Area Chart with Tooltip</h2>
            <div className="js-stacked-area-chart-tooltip-container card--chart"></div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h2 className="tutorial__heading">Stacked Area Chart with fixed Aspect Ratio</h2>
            <div className="js-stacked-area-chart-fixed-container card--chart"></div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <h2 className="tutorial__heading">Stacked Area Chart with custom stack order</h2>
            <div className="js-stacked-area-chart-tooltip-bis-container card--chart"></div>
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
    )
  }
}
