import React from 'react';
import { select, selectAll, event } from 'd3-selection';
import { timeFormat } from 'd3-time-format';
import PubSub from 'pubsub-js';

import { brush } from 'britecharts';
import { BrushDataBuilder } from './fixtures/brushChartDataBuilder';

require('./helpers/resizeHelper');

function createBrushChart(optionalColorSchema) {
    const brushChart = brush();
    const testDataSet = new BrushDataBuilder();
    const brushContainer = select('.js-brush-chart-container');
    const containerWidth = brushContainer.node() ? brushContainer.node().getBoundingClientRect().width : false;
    let dataset;

    let elementDateRange = select('.js-date-range');

    if (containerWidth) {
        dataset = testDataSet.withSimpleData().build();

        brushChart
            .width(containerWidth)
            .height(125)
            .on('customBrushStart', function(brushExtent) {
                let format = timeFormat('%m/%d/%Y');

                select('.js-start-date').text(format(brushExtent[0]));
                select('.js-end-date').text(format(brushExtent[1]));

                elementDateRange.classed('is-hidden', false);
            })
            .on('customBrushEnd', function(brushExtent) {
                // eslint-disable-next-line no-console
                console.log('rounded extent', brushExtent);

                if (brushExtent[0] === null) {
                    elementDateRange.classed('is-hidden', true);
                }
            });

        if (optionalColorSchema) {
          brushChart.gradient(optionalColorSchema);
        }

        brushContainer.datum(dataset).call(brushChart);

        brushChart.dateRange(['7/15/2015', '7/25/2015'])
    }

    return brushChart;
}

const BriteBrush = (color) => {
  // Show charts if container available
  if (select('.js-brush-chart-container').node()){
      let brushChart = createBrushChart(color);

      if(color) {
        selectAll('.handle.brush-rect')
        .style('fill', color[0]);
      }

      const redrawCharts = function () {
          const brushContainer = select('.js-brush-chart-container');
          const containerWidth = brushContainer.node() ? brushContainer.node().getBoundingClientRect().width : false;

          brushChart
              .width(containerWidth)
              .dateRange([null, null]);

          if(color) {
            selectAll('.handle.brush-rect')
            .style('fill', color[0]);
          }

          brushContainer.call(brushChart);
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);

      select('#clear-selection').on('click', function (e) {
          brushChart.dateRange([null, null]);
          event.preventDefault();
      });
  }
}

export default class BarChart extends React.Component {
  componentDidMount() {
    new BriteBrush(this.props.color);
  }

  render() {
    return (
      <div className="container" id="brush" style={{ width: '80%', margin: '0 auto' }}>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2 className="tutorial__heading">Simple Brush Chart</h2>
              <div className="js-brush-chart-container card--chart"></div>
              <p className="js-date-range date-range is-hidden">
                  Selected from <span className="js-start-date"/> to <span className="js-end-date"/><br/>
                  <a id="clear-selection" href="#">Clear Selection</a>
              </p>
              <p>Brush chart to use with other charts as a time range selector.</p>
            </article>
          </div>
        </div>
      </div>
    );
  }
}
