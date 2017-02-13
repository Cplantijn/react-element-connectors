import { Component, PropTypes } from 'react';
import shortId from 'short-id';

export default class Connectors extends Component {
  constructor(props) {
    super(props);
    this._drawLines = this._drawLines.bind(this);
  }

  _drawLines() {
    const {
      nodeMap = null,
      strokeWidth = 5,
      strokeColor = 'red',
      strokeOpacity,
      lineFill = 'transparent'
    } = this.props;

    if (!nodeMap) {
      return null;
    }

    console.log('map', nodeMap);
    return nodeMap.map((node, index) => {
      if (index < nodeMap.length - 1) {
        const nextNode = nodeMap[index + 1];
        const lineHeight = Math.round((nextNode.top + (nextNode.height / 2)) - (node.top + (node.height / 2)));
        const lineWidth = Math.round(nextNode.left - node.left);
        const lineTop = Math.round(node.top + (node.height / 2)) - strokeWidth;
        const cpt = Math.round(lineWidth * Math.min(lineHeight / 300, 1));
        let d = `M0,${strokeWidth} C${cpt},0 ${lineWidth - cpt},${lineHeight + strokeWidth} ${lineWidth},${lineHeight + strokeWidth}`;

        d = `M${(node.width / 2) + node.left},${node.top} C${cpt},0 ${lineWidth - cpt},${lineHeight + strokeWidth} ${(nextNode.width / 2) + nextNode.left},${nextNode.top - nextNode.height}`;
        return (
          <path
            key={shortId.generate()}
            d={d}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={strokeOpacity}
            fill={lineFill}
          />
        );
      }
    })
  }

  render() {
    const connectors = this._drawLines();
    return (
      <svg className="rec-svg-overlay">
        { connectors }
      </svg>
    );
  }
}

Connectors.propTypes = {};
