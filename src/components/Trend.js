import React from 'react';
import {
  Resizable,
  ChartContainer,
  ChartRow,
  Charts,
  AreaChart,
  LineChart,
  Legend,
  MultiBrush,
  YAxis,
  styler
} from 'react-timeseries-charts';
import { format } from 'd3-format';
import _ from 'lodash';
import { TimeSeries, TimeRange } from 'pondjs';
import PropTypes from 'prop-types';
import { setSnapshot } from '../actions/fuelSavingsActions';
// import data from '../mockData/data';
import {connect} from 'react-redux';

const calculateSentiment = ({angry, confused, calm, happy, disgusted, surprised, fear, sad}) => {
  return(
    parseFloat(
      (
        (parseFloat(happy + calm, 2)/2 * 5) -
        (parseFloat(disgusted + angry + confused + fear + sad))
      ), 2
    )
  )
}

const getTime = d => new Date(d).getTime();




// const upDownStyle = styler([
//   { key: 'value', color: '#24AB31', opacity: .5 }
// ]);

// const upDownStyle = {
//   colorScheme: 'Paired',
//   columnNames: [
//     'value'
//   ],
//   columnStyles: {
//     value: {
//       color: 'linear-gradient(180deg, #24AB31 0%, rgba(255,255,255,0.00) 100%)'
//     }
//   }
// }
const lineColor = '00b8f1';
const color = '#24AB31';
const upDownStyle = {
  "value": {
    line: {
      normal: {stroke: lineColor, fill: "none", strokeWidth: 1},
      highlighted: {stroke: lineColor, fill: "none", strokeWidth: 1},
      selected: {stroke: lineColor, fill: "none", strokeWidth: 2},
      muted: {stroke: lineColor, fill: "none", opacity: 0.4, strokeWidth: 1}
    },
    area: {
      normal: {fill: color, stroke: "none", opacity: 0.1},
      highlighted: {fill: color, stroke: "none", opacity: 0.1},
      selected: {fill: color, stroke: "none", opacity: 0.1},
      muted: {fill: color, stroke: "none", opacity: 0.1}
    }
  }
}


const trackerStyle = {
  line: {
    stroke: '#a62011',
    cursor: 'crosshair',
    pointerEvents: 'none'
  }
};

class Trend extends React.Component {
  state = {
    tracker: null,
    timerange: null,
    selected: null,
    selections: [],
    sentiment: null
  };

  componentDidUpdate(prevProps) {
    if(prevProps.data !== this.props.data) {
      // console.log(this.props.setSnapshot, this.props.data[0])
      const sentiment = new TimeSeries({
        name: `Sentiment`,
        columns: ['time', 'value'],
        points: _.chain(this.props.data).map(p => [p.timestamp, calculateSentiment(p)]).sortBy(p=>p[0]).value()
      });

      this.setState({
        sentiment,
        timerange: sentiment.range()
      }, () => this.props.setSnapshot(this.props.data[0]))
    }
  }

  handleTrackerChanged = (t, scale) => {
    const {sentiment} = this.state;

    this.setState({
      tracker: t,
      trackerEvent:
        t && sentiment.at(sentiment.bisect(t)),

      trackerX: t && scale(t)
    }, () => {
      return (
        t && this.props.setSnapshot(this.props.data[sentiment.bisect(t)])
      )
    });
  };

  handleTimeRangeChange = timerange => {
    this.setState({ timerange });
  };

  handleSelectionChange = (timerange, i) => {
    const selections = this.state.selections;
    selections[i] = timerange;
    this.setState({ selections });
  };

  render() {
    const {sentiment} = this.state;
    // console.log('sentiment', sentiment);
    const dateStyle = {
      fontSize: 12,
      color: '#AAA',
      borderWidth: 1,
      borderColor: '#F4F4F4'
    };

    const markerStyle = {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      color: '#AAA',
      marginLeft: '5px',
      fontSize: 8
    };

    const max = sentiment && _.max([ sentiment.max('value')]);
    const axistype = 'linear';
    const tracker = this.state.tracker ? `${this.state.tracker}` : '';
    const formatter = format('.4s');

    return (
      <div>
        <div className="row">
          <div className="col-md-12">
            {this.state.tracker ? (
              <div style={{ position: 'relative' }}>
                <div
                  style={{ position: 'absolute', left: this.state.trackerX }}>
                  <div style={markerStyle}>
                    Sentiment: {this.state.trackerEvent.get('value').toFixed(1)}
                  </div>
                </div>
              </div>
            ) : null}
            {
              sentiment &&
              <Resizable>
                <ChartContainer
                  timeRange={sentiment.range()}
                  trackerStyle={trackerStyle}
                  onTrackerChanged={this.handleTrackerChanged}
                  enablePanZoom={false}
                  maxTime={sentiment.range().end()}
                  minTime={sentiment.range().begin()}
                  minDuration={1000 * 60 * 60}
                  onBackgroundClick={() => this.setState({ selection: null })}
                  onTimeRangeChanged={this.handleTimeRangeChange}
                  hideTimeAxis={true}
                >
                  <ChartRow height="70" debug={false}>
                    <Charts>
                      <AreaChart
                        axis="sentiments"
                        series={sentiment}
                        columns={{
                          up: ['value'],
                          down: []
                        }}
                        style={upDownStyle}
                      />
                      <MultiBrush
                    timeRanges={this.state.selections}
                    style={i => {
                      if (i === this.state.selected) {
                        return { fill: '#46abff' };
                      } else {
                        return { fill: '#cccccc' };
                      }
                    }}
                    allowSelectionClear
                    onTimeRangeChanged={this.handleSelectionChange}
                    onTimeRangeClicked={i => this.setState({ selected: i })}
                    />
                    </Charts>
                    <YAxis
                      id="sentiments"
                      min={-max}
                      max={max}
                      tickCount={0}
                      hideAxisLine={true}
                      absolute={true}
                      width="60"
                      type={axistype}
                      style={{ label: {fill: 'none'}, values: { fill: 'none'},  axis: {fill: 'none'}, ticks: {display: 'none'}}}
                    />
                  </ChartRow>
                </ChartContainer>
              </Resizable>
            }
          </div>

        </div>
      </div>
    );
  }
}

Trend.propTypes = {
  data: PropTypes.object
};

Trend.defaultProps = {
  data: []
}

export default connect(
  null,
  { setSnapshot }
)(Trend);



// <div className="col-md-12">
// <hr />
// <table className="table">
//   <thead>
//     <tr>
//       <th scope="col">Date range</th>
//       <th scope="col">In Avg</th>
//       <th scope="col">Out Avg</th>
//       <th scope="col">Actions</th>
//     </tr>
//   </thead>
//   <tbody>
//     {this.state.selections.map((tr, i) => {
//       return (
//         <tr
//           key={i}
//           style={
//             i === this.state.selected
//               ? { background: '#46abff60' }
//               : {}
//           }>
//           <td
//             onClick={() =>
//               this.setState({ selected: i })
//             }>{`${tr.humanize()}`}</td>
//           <td style={{ padding: 10 }}>{`${formatter(
//             sentiment.crop(tr).avg('value')
//           )}b`}</td>
//           <td>
//             <i
//               className="glyphicon glyphicon-remove"
//               style={{ cursor: 'pointer' }}
//               onClick={() => {
//                 const selection = this.state.selections;
//                 this.setState({
//                   selections: selection.filter(
//                     (item, j) => j !== i
//                   ),
//                   selected: null
//                 });
//               }}
//             />
//           </td>
//         </tr>
//       );
//     })}
//   </tbody>
// </table>
// </div>
