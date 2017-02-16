import { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ConnectNode extends Component {
  constructor() {
    super();
    this._calculateSVG = this._calculateSVG.bind(this);
    this._node = null;
    this._svgContainer = null;
  }

  componentDidMount() {
    window.addEventListener('resize', this._calculateSVG);
    this._calculateSVG();
  }

  componentWillUmount() {
    window.removeEventListener('resize', this._calculateSVG);
  }

  _calculateSVG() {
    const { drawOutline, outlineShape = 'circle', strokeColor = '#000', strokeWidth = 1 } = this.props;

    if (drawOutline && this._node && this._svgContainer) {
      const node = this._node.getBoundingClientRect();
      this._svgContainer.setAttribute('height', node.height);
      this._svgContainer.setAttribute('width', node.width);
      if (outlineShape === 'circle') {
        const radius = Math.min(node.width, node.height) / 2;
        this._svgContainer.innerHTML =
          `<circle
              fill="none"
              stroke="${strokeColor}"
              stroke-width="${strokeWidth}"
              cx="${node.width / 2}"
              cy="${radius}"
              transform="rotate(-90 ${node.width / 2} ${radius})"
              r="${radius}" />
            <circle
              fill="none"
              stroke="${strokeColor}"
              stroke-width="${strokeWidth}"
              cx="${node.width / 2}"
              cy="${radius}"
              transform="rotate(-90 ${node.width / 2} ${radius})"
              r="${radius}" />`;
      } else {
        this._svgContainer.innerHTML =
          `<rect
          fill="none"
          width="${node.width}"
          height="${node.height}"
          stroke="${strokeColor}"
          stroke-width="${strokeWidth}" />`;
      }
    }
  }
  render() {
    const {
      children = null,
      className = '',
      drawOutline = false,
      outlineShape = 'circle',
      ...rest
    } = this.props;

    const cls = classNames({
      'rec-node': true,
      'draw-outline': true
    }, className);

    let svgOutline = null;

    if (drawOutline) {
      svgOutline = (<svg height="0" width="0" ref={s => this._svgContainer = s} />);
    }

    return (
      <div className={cls} {...rest} ref={d => this._node = d}>
        { svgOutline }
        { children }
      </div>
    );
  }
}

ConnectNode.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
