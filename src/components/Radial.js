import React from 'react';

const polarToX = (angle, distance) => Math.cos(angle - Math.PI / 2) * distance;

const polarToY = (angle, distance) => Math.sin(angle - Math.PI / 2) * distance;

const points = points => {
  return points
    .map(point => point[0].toFixed(4) + ',' + point[1].toFixed(4))
    .join(' ');
};

const axis = options => (col, i) => (
  <polyline
    key={`poly-axis-${i}`}
    points={points([
      [0, 0],
      [
        polarToX(col.angle, options.chartSize / 2),
        polarToY(col.angle, options.chartSize / 2)
      ]
    ])}
    {...options.axisProps(col)}
  />
);

const dot = (columns, options) => (chartData, i) => {
  const data = chartData.data;
  const meta = chartData.meta || {};
  const extraProps = options.dotProps(meta);
  let mouseEnter = () => {};
  let mouseLeave = () => {};
  if (extraProps.mouseEnter) {
    mouseEnter = extraProps.mouseEnter;
  }
  if (extraProps.mouseLeave) {
    mouseLeave = extraProps.mouseLeave;
  }
  return columns.map(col => {
    const val = data[col.key];
    if ('number' !== typeof val) {
      throw new Error(`Data set ${i} is invalid.`);
    }

    return (
      <circle
        key={`dot-${col.key}-${val}`}
        cx={polarToX(col.angle, (val * options.chartSize) / 2)}
        cy={polarToY(col.angle, (val * options.chartSize) / 2)}
        className={[extraProps.className, meta.class].join(' ')}
        onMouseEnter={() => mouseEnter({ key: col.key, value: val, idx: i })}
        onMouseLeave={() => mouseLeave({})}
      />
    );
  });
};

const linearStroke = (meta) => {
  return meta.linear && (
    <defs>
      <linearGradient id="linear-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={meta.linear.color0}/>
        <stop offset="100%" stopColor={meta.linear.color1}/>
      </linearGradient>
    </defs>
  )
}

const linearFill = (meta) => {
  return meta.linear && (
    <defs>
      <linearGradient id="linear-fill" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopOpacity='.3' stopColor={meta.linear.color0}/>
        <stop offset="100%" stopOpacity='.3' stopColor={meta.linear.color1}/>
      </linearGradient>
    </defs>
  )
}

const shape = (columns, options) => (chartData, i) => {
  const data = chartData.data;
  const meta = chartData.meta || {};
  const extraProps = options.shapeProps(meta);
  return (
    <React.Fragment>
      {linearStroke(meta)}
      {linearFill(meta)}
      <path
        key={`shape-${i}`}
        d={options.smoothing(
          columns.map(col => {
            const val = data[col.key];
            if ('number' !== typeof val) {
              throw new Error(`Data set ${i} is invalid.`);
            }

            return [
              polarToX(col.angle, (val * options.chartSize) / 2),
              polarToY(col.angle, (val * options.chartSize) / 2)
            ];
          })
        )}
        {...extraProps}
        stroke={meta.linear ? "url(#linear-stroke)" : meta.color}
        fill={meta.linear ? "url(#linear-fill)" : meta.color}
        className={[extraProps.className, meta.class].join(' ')}
      />
    </React.Fragment>
  );
};

const scale = (options, value) => {
  return (
    <React.Fragment>
      {
        (value * 10) % 2 === 0 && (value < 1)
        &&
        <text
          y={-(options.chartSize/2) * value - (options.chartSize/2) / 40}
          x={(options.chartSize/2) / 20}
          {...options.scaleTextProps(value)
        }
        >{value * 100}</text>
      }
      <circle
        key={`circle-${value}`}
        cx={0}
        cy={0}
        r={(value * options.chartSize) / 2}
        {...options.scaleProps(value)}
      />
    </React.Fragment>
  )
};

const caption = (options, data) => col => {
  const dataValue = data[col.caption.toLowerCase()];
  const polarX = parseFloat(polarToX(col.angle, (options.size / 2) * 0.95).toFixed(4), 2);
  const polarY = parseFloat(polarToY(col.angle, (options.size / 2) * 0.95).toFixed(4), 2);
  const fontSize = options.captionProps(col) && options.captionProps(col).fontSize || 14;
  const subFontSize = options.subCaptionProps(col) && options.subCaptionProps(col).fontSize || 4;
  const angleAdjustment = Math.abs(3-col.angle)
  const quarterCaption = col.caption.length / 4;
  const adjustmentX = (length, font) => polarX <= 0 ? (-length * font) - Math.abs(polarX * .15) : 0;
  // <svg x={polarX + adjustmentX(col.caption.length / 4, fontSize)} y={polarY}  overflow='visible'>
  return (
    <React.Fragment>
        <text
          key={`caption-of-${col.key}`}
          x={polarX + adjustmentX(col.caption.length / 4, fontSize)}
          y={polarY}
          {...options.captionProps(col)}
        >
          {col.caption}
        </text>
        {
          !isNaN(dataValue) &&
          <text
            x={polarX + adjustmentX(col.caption.length / 4, fontSize)}
            y={polarY}
            dx={(col.caption.length/4 * fontSize) - subFontSize < 0
              ? 0
              : (col.caption.length/4 * fontSize) - subFontSize}
            dy={fontSize}
            {...options.subCaptionProps(col)}
          >
            {`${Math.round(dataValue * 100)}%`}
          </text>
        }
        </React.Fragment>
        )
      };
      // </svg>

const render = (captions, chartData, options = {}) => {
  if ('object' !== typeof captions || Array.isArray(captions)) {
    throw new Error('caption must be an object');
  }
  if (!Array.isArray(chartData)) {
    throw new Error('data must be an array');
  }
  options.chartSize = options.size / options.zoomDistance;

  const columns = Object.keys(captions).map((key, i, all) => {
    return {
      key,
      caption: captions[key],
      angle: (Math.PI * 2 * i) / all.length
    };
  });
  const groups = [
    <g key={`g-groups}`}>{chartData.map(shape(columns, options))}</g>
  ];
  if (options.captions) {
    groups.push(<g key={`poly-captions`}>{columns.map(caption(options, chartData[0].data))}</g>);
  }
  if (options.dots) {
    groups.push(<g key={`g-dots`}>{chartData.map(dot(columns, options))}</g>);
  }
  if (options.axes) {
    groups.unshift(<g key={`group-axes`}>{columns.map(axis(options))}</g>);
  }
  if (options.scales > 0) {
    const scales = [];
    for (let i = options.scales; i > 0; i--) {
      scales.push(scale(options, i / options.scales));
    }
    groups.unshift(<g key={`poly-scales`}>{scales}</g>);
  }
  const delta = (options.size / 2).toFixed(4);
  return <g transform={`translate(${delta},${delta})`}>{groups}</g>;
};

export default render;
