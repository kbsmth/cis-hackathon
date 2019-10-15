import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import { heatmap } from 'britecharts';
import { HeatmapDataBuilder } from './fixtures/heatmapChartDataBuilder';
import colorSelectorHelper from './helpers/colorSelector';

require('./helpers/resizeHelper');

const aTestDataSet = () => new HeatmapDataBuilder();

function createWeeklyHeatmapChart(optionalColorSchema) {
    let heatmapChart = heatmap(),
        heatmapContainer = select('.js-heatmap-chart-container'),
        containerWidth = heatmapContainer.node() ? heatmapContainer.node().getBoundingClientRect().width : false,
        dataset;

    if (containerWidth) {
        select('.js-download-button').on('click', function () {
            heatmapChart.exportChart('heatmap.png', 'Britecharts Heatmap');
        });

        dataset = aTestDataSet().withWeeklyData().build();

        heatmapChart
            .boxSize(30);

        if (optionalColorSchema) {
            heatmapChart.colorSchema(optionalColorSchema);
        }

        heatmapContainer.datum(dataset).call(heatmapChart);
    }
}

const BriteHeatmap = (color) => {
  // Show charts if container available
  if (select('.js-heatmap-chart-container').node()) {
      createWeeklyHeatmapChart(color);

      let redrawCharts = function () {
          selectAll('.heatmap').remove();
          createWeeklyHeatmapChart(color);
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);

      // Color schema selector
      colorSelectorHelper.createColorSelector('.js-color-selector-container', '.heatmap', function (newSchema) {
          createWeeklyHeatmapChart(newSchema);
      });
  }
}

export default class Heatmap extends React.Component {
  componentDidMount() {
    new BriteHeatmap(this.props.color)
  }

  render() {
    return (
      <div className="container" id="heatmap" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2 className="tutorial__heading">Heatmap Chart</h2>
              <div className="js-heatmap-chart-container heatmap-chart-container card--chart"></div>
            </article>
          </div>
        </div>
      </div>
    )
  }
}
