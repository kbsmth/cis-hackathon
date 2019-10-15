import React from 'react';
import { select } from 'd3-selection';
import PubSub from 'pubsub-js';

import bullet from 'britecharts/dist/umd/bullet.min';
import { BulletChartDataBuilder } from './fixtures/bulletChartDataBuilder';
import colorSelectorHelper from './helpers/colorSelector';

require('./helpers/resizeHelper');

function createBulletChart(optionalColorSchema) {
    const testDataSet = new BulletChartDataBuilder();
    const bulletContainer = select('.js-bullet-chart-container');
    const containerWidth = bulletContainer.node()
        ? bulletContainer.node().getBoundingClientRect().width
        : false;
    let bulletChart, dataset;

    if (containerWidth) {
        dataset = testDataSet.withCpuData().build();

        // remove all current list of children before
        // appending the next one
        bulletContainer.selectAll('*').remove();

        dataset.forEach(data => {
            bulletChart = new bullet();
            bulletChart.width(containerWidth);

            if (optionalColorSchema) {
                bulletChart.colorSchema(optionalColorSchema);
            }

            bulletContainer.datum(data).call(bulletChart);
        });
    }
}

const BriteBullet = (color) => {
  // Show charts if container available
  if (select('.js-bullet-chart-container').node()) {
    createBulletChart(color);

    let redrawCharts = function() {
        select('.bullet-chart').remove();

        createBulletChart(color);
    };

    // Redraw charts on window resize
    PubSub.subscribe('resize', redrawCharts);

    // Color schema selector
    colorSelectorHelper.createColorSelector('.js-color-selector-container', '.bullet-chart', function (newSchema) {
        createBulletChart(newSchema);
    });
  }
}

export default class Bullet extends React.Component {
  componentDidMount() {
    new BriteBullet(this.props.color);
  }

  render() {
    return (
      <div className="container" id="bulletChart" style={{ width: '80%', margin: '0 auto' }}>
        <div className="row">
          <div className="col-md-6">
            <article>
              <h2 className="tutorial__heading">Bullet Chart</h2>
              <div className="js-bullet-chart-container card--chart"></div>
              <p>This is the bullet chart used for showing CPU usage.</p>
              <p>We have included a resize listener to show how the different charts respond to changes on the viewport.</p>
            </article>
          </div>
        </div>
      </div>
    );
  }
}
