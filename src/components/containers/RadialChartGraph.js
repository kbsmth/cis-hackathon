import React, { Component } from 'react';
import RadialChart from '../RadialChart';
import { connect } from 'react-redux';

class RadialChartGraph extends Component {
  // constructor(props) {
  //   super(props);
  //   this.mousePos = [0, 0];
  //   this.state = {
  //     content,
  //     dot: {}
  //   };
  // }

  // componentDidMount() {
  //   document.addEventListener('mousemove', this.handleMouseMove);
  // }

  // This is only used for the "with dots" example for
  // positioning the tooltip
  // handleMouseMove = e => {
  //   this.mousePos = [e.pageX, e.pageY];
  // };

  // handleToolTip = dot => {
  //   this.setState({ dot });
  // };

  render() {
    const { snapshot } = this.props;
    console.log(snapshot);
    // const { content, dot } = this.state;

    const getProps = (d) => {
      return ({
        captions: {
            confused: 'Confused',
            disgusted: 'Disgusted',
            happy: 'Happy',
            angry: 'Angry',
            surprised: 'Surprised',
            sad: 'Sad',
            calm: 'Calm',
            fear: 'Fear',
        },
        data: [
          {
            data: { confused: d.confused/100, disgusted: d.disgusted/100, happy: d.happy/100, angry: d.angry/100, surprised: d.surprised/100, sad: d.sad/100, calm: d.calm/100, fear: d.fear/100 },
            meta: {
              linear: {
                color0: '#00A0D1',
                color1: '#16A693'
              }
            }
          }
        ],
        options: {
          subCaptionProps: () => ({
            fontSize: 12
          }),
          captionProps: () => ({
            fill: 'black',
            fontSize: 16
          }),
          scaleProps: () => ({
            fill: 'transparent',
            stroke: '#999',
            strokeWidth: '.2'
          }),
          scaleTextProps: () => ({
            fontSize: '12px'
          }),
          axisProps: () => ({
            fill: '#fafafa',
            stroke: '#999',
            strokeWidth: '.5'
          }),
          shapeProps: () => ({
            strokeWidth: '3'
          })
        }
      })
    }

    //   )
    //   name: 'Data',
    //   captions: {
    //     confused: 'Confused',
    //     disgusted: 'Disgusted',
    //     happy: 'Happy',
    //     angry: 'Angry',
    //     surprised: 'Surprised',
    //     sad: 'Sad',
    //     calm: 'Calm',
    //     fear: 'Fear',
    //   },
    //   chart: [
    //     {
    //       data: { confused: snapshot.confused, disgusted: snapshot.disgusted, happy: snapshot.happy, angry: snapshot.angry, surprised: snapshot.surprised, sad: snapshot.sad, calm: snapshot.calm, fear: snapshot.fear },
    //       meta: {
    //         linear: {
    //           color0: '#00A0D1',
    //           color1: '#16A693'
    //         }
    //       }
    //     }
    //   ],
    //   options: {
    //     subCaptionProps: () => ({
    //       fontSize: 12
    //     }),
    //     captionProps: () => ({
    //       fill: 'black',
    //       fontSize: 16
    //     }),
    //     scaleProps: () => ({
    //       fill: 'transparent',
    //       stroke: '#999',
    //       strokeWidth: '.2'
    //     }),
    //     scaleTextProps: () => ({
    //       fontSize: '12px'
    //     }),
    //     axisProps: () => ({
    //       fill: '#fafafa',
    //       stroke: '#999',
    //       strokeWidth: '.5'
    //     }),
    //     shapeProps: () => ({
    //       strokeWidth: '3'
    //     })
    //   }
    // }

    return (
      <div className="container" style={{display: 'flex', justifyContent: 'center' }}>
        {
          snapshot
          &&
          <RadialChart
            {...getProps(snapshot)}
          />
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    snapshot: state.snapshot.data
  };
}

export default connect(
  mapStateToProps,
)(RadialChartGraph);
