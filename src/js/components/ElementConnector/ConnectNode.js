import { Component, PropTypes } from 'react';
import classNames from 'classnames';
import $ from 'jquery';

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
    const { drawOutline, outlineShape = 'circle', strokeColor = '#1f303d', strokeWidth = 2 } = this.props;

    if (drawOutline && this._node && this._svgContainer) {
      const $node = $(this._node);
      const $svgContainer = $(this._svgContainer);
      const nodeHeight = $node.outerHeight();
      const nodeWidth = $node.outerWidth();

      // Compensate for borders on root node.
      let borderWidth = 0;
      if ($node.css('borderWidth') !== '0px') {
        if (/px$/.test($node.css('borderWidth'))) {
          borderWidth = parseInt($node.css('borderWidth').replace('px', ''));
        } else if (/rem$/.test($node.css('borderWidth'))) {
          const bodyFontSize = parseInt($('body').css('font-size').replace('px', ''));
          borderWidth = Number($node.css('borderWidth').replace('rem', '')) * bodyFontSize;
        }
      }

      $svgContainer
      .attr('height', nodeHeight)
      .attr('width', nodeWidth)
      .css({left: borderWidth * -1, top: borderWidth * -1})

      if (outlineShape === 'circle') {
        const radius = Math.max((nodeWidth, nodeHeight) / 2);
        this._svgContainer.innerHTML =
          `<circle
              fill="none"
              stroke="${strokeColor}"
              stroke-width="${strokeWidth}"
              cx="${(nodeWidth / 2)}"
              cy="${radius}"
              transform="rotate(-90 ${nodeWidth / 2} ${radius})"
              r="${radius}" />
            <circle
              fill="none"
              stroke="${strokeColor}"
              stroke-width="${strokeWidth}"
              cx="${(nodeWidth / 2)}"
              cy="${radius}"
              transform="rotate(-90 ${nodeWidth / 2} ${radius})"
              r="${radius}" />`;
      } else {
        this._svgContainer.innerHTML =
          `<rect
          fill="none"
          width="${nodeWidth}"
          height="${nodeHeight}"
          stroke="${strokeColor}"
          stroke-width="${strokeWidth}" />`;
      }
    }
  }
  render() {
    const {
      Component = 'div',
      children = null,
      className = '',
      drawOutline = false,
      outlineShape = 'circle',
      strokeColor = '#888',
      strokeWidth = 2,
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
      <Component className={cls} {...rest} ref={d => this._node = d}>
        { svgOutline }
        { children }
      </Component>
    );
  }
}

ConnectNode.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};
