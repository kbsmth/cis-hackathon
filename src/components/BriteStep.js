import React from 'react';
import { select, selectAll } from 'd3-selection';
import PubSub from 'pubsub-js';

import { step, miniTooltip } from 'britecharts';
import { StepDataBuilder } from './fixtures/stepChartDataBuilder';

require('./helpers/resizeHelper');


const aTestDataSet = () => new StepDataBuilder();
let redrawCharts;

function createStepChart() {
    let stepChart = step(),
        tooltip = miniTooltip(),
        stepContainer = select('.js-step-chart-container'),
        containerWidth = stepContainer.node() ? stepContainer.node().getBoundingClientRect().width : false,
        tooltipContainer,
        dataset;

    if (containerWidth) {
        select('#button').on('click', function() {
            stepChart.exportChart('stepchart.png', 'Britecharts Step Chart');
        });

        dataset = aTestDataSet().withSmallData().build();

        stepChart
            .width(containerWidth)
            .height(300)
            .xAxisLabel('Meal Type')
            .xAxisLabelOffset(45)
            .yAxisLabel('Quantity')
            .yAxisLabelOffset(-50)
            .margin({
                top: 40,
                right: 40,
                bottom: 50,
                left: 80
            })
            .on('customMouseOver', tooltip.show)
            .on('customMouseMove', tooltip.update)
            .on('customMouseOut', tooltip.hide);

        stepContainer.datum(dataset.data).call(stepChart);

        tooltip.nameLabel('key');

        tooltipContainer = select('.js-step-chart-container .step-chart .metadata-group');
        tooltipContainer.datum([]).call(tooltip);
    }
}

const BriteStep = (color) => {
  // Show charts if container available
  if (select('.js-step-chart-container').node()){
      createStepChart(color);
      if(color) {
        selectAll('.step')
        .style('fill', color[0]);
      }

      // For getting a responsive behavior on our chart,
      // we'll need to listen to the window resize event
      redrawCharts = function(){
          select('.step-chart').remove();

          createStepChart(color);
          if(color) {
            selectAll('.step')
            .style('fill', color[0]);
          }
      };

      // Redraw charts on window resize
      PubSub.subscribe('resize', redrawCharts);
  }
}

export default class StepChart extends React.Component {
  componentDidMount() {
    new BriteStep(this.props.color)
  }

  render() {
    return (
      <div className="container" id="step" style={{ width: '80%' }}>
        <div className="row">
          <div className="col-md-12">
            <article>
              <h2 className="tutorial__heading">Step Chart</h2>
              <div className="js-step-chart-container card--chart"></div>
            </article>
          </div>
        </div>
      </div>
    )
  }
}
