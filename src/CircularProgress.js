import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';

export default class CircularProgress extends React.PureComponent {
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    var start = this.polarToCartesian(x, y, radius, endAngle * 0.9999);
    var end = this.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y];
    return d.join(' ');
  }

  clampFill = fill => Math.min(100, Math.max(0, fill));

  render() {
    const {
      size,
      width,
      backgroundWidth,
      tintColor,
      backgroundColor,
      style,
      rotation,
      lineCap,
      arcSweepAngle,
      fill,
      children,
      childrenContainerStyle,
      padding,
      renderCap,
      dashedBackground,
    } = this.props;

    const maxWidthCircle = backgroundWidth ? Math.max(width, backgroundWidth) : width;
    const sizeWithPadding = size / 2 + padding / 2;
    const sizeMinusPadding = size / 2 - padding / 2;
    const radius = size / 2 - maxWidthCircle / 2 - padding / 2;

    const backgroundPath = this.circlePath(
      sizeWithPadding,
      sizeMinusPadding,
      radius,
      0,
      arcSweepAngle
    );
    const currentFillAngle = (arcSweepAngle * this.clampFill(fill)) / 100;
    const circlePath = this.circlePath(
      sizeWithPadding,
      sizeMinusPadding,
      radius,
      0,
      currentFillAngle
    );
    const coordinate = this.polarToCartesian(
      sizeWithPadding,
      sizeMinusPadding,
      radius,
      currentFillAngle
    );
    const cap = this.props.renderCap ? this.props.renderCap({ center: coordinate }) : null;

    const offset = size - maxWidthCircle * 2;

    const localChildrenContainerStyle = {
      ...{
        position: 'absolute',
        left: maxWidthCircle + padding / 2,
        top: maxWidthCircle + padding / 2,
        width: offset,
        height: offset,
        borderRadius: offset / 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      ...childrenContainerStyle,
    }

    const dashedBackgroundStyle = dashedBackground.gap > 0
      ? `${dashedBackground.width}, ${dashedBackground.gap}`
      : dashedBackground;
    
    const strokeDasharray = Object.values(dashedBackgroundStyle)
      .map(value => parseInt(value));

    return (
      <View style={style}>
        <Svg width={size + padding} height={size + padding}>
          <G rotation={rotation} originX={size / 2} originY={size / 2}>
            {backgroundColor && (
              <Path
                d={backgroundPath}
                stroke={backgroundColor}
                strokeWidth={backgroundWidth || width}
                strokeLinecap={lineCap}
                strokeDasharray={strokeDasharray}
                fill="transparent"
              />
            )}
            {fill > 0 && (
              <Path
                d={circlePath}
                stroke={tintColor}
                strokeWidth={width}
                strokeLinecap={lineCap}
                fill="transparent"
              />
            )}
            {cap}
          </G>
        </Svg>
        {children && <View style={localChildrenContainerStyle}>{children(fill)}</View>}
      </View>
    );
  }
}

CircularProgress.propTypes = {
  style: ViewPropTypes.style,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  backgroundWidth: PropTypes.number,
  tintColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  rotation: PropTypes.number,
  lineCap: PropTypes.string,
  arcSweepAngle: PropTypes.number,
  children: PropTypes.func,
  childrenContainerStyle: ViewPropTypes.style,
  padding: PropTypes.number,
  renderCap: PropTypes.func,
  dashedBackground: PropTypes.object,
};

CircularProgress.defaultProps = {
  tintColor: 'black',
  rotation: 90,
  lineCap: 'butt',
  arcSweepAngle: 360,
  padding: 0,
  dashedBackground: { width: 0, gap: 0 },
};
