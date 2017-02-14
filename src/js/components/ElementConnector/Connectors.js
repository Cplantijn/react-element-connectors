import { Component, PropTypes } from 'react';
import shortId from 'short-id';

export default class Connectors extends Component {
  constructor(props) {
    super(props);
    this._drawLines = this._drawLines.bind(this);
    this._animateLines = this._animateLines.bind(this);
    this._svgContainer = null;
    this._paths = [];
  }

  componentDidMount() {
    const { nodeMap = null } = this.props;
    if (nodeMap) {
      this._animateLines();
    }
  }

  componentDidUpdate(oldProps) {
    const { nodeMap: oldNodeMap = null } = oldProps;
    const { nodeMap = null } = this.props;

    if (oldNodeMap && nodeMap) {
      const oldNodeLen = Object.keys(oldNodeMap).length;
      const currentNodeLen = Object.keys(nodeMap).length;
      if (currentNodeLen !== oldNodeLen) {
        this._animateLines(oldNodeLen - 1, currentNodeLen > oldNodeLen);
      }
    } else if (!oldNodeMap && nodeMap) {
      this._animateLines();
    }
  }

  _animateLines(startIndex = 0, adding = true) {
    const {
      animate = true,
      animationDuration = 400,
      animationDelay = 0,
      animationEasing = 'ease-in-out'
    } = this.props;

    if (!this._svgContainer || !animate || !this._paths.length) {
      return false;
    }

    let delayQueue = animationDelay;
    const validPaths = this._paths.filter(Boolean);

    validPaths.forEach((path, index) => {
      if (index >= startIndex) {
        const length = path.getTotalLength();
        path.style.transition = path.style.transition = 'none';
        path.style.strokeDasharray = `${length} ${length}`;
        path.style.strokeDashoffset = length;
        path.getBoundingClientRect();
        path.style.transition = path.style.transition = `stroke-dashoffset ${animationDuration / 1000}s ${animationEasing}`;

        setTimeout(() => {
          path.style.strokeDashoffset = 0;
        }, delayQueue);
        delayQueue += animationDuration;
      }
    });
  }

  _drawLines() {
    const {
      nodeMap = null,
      strokeWidth = 1,
      strokeColor = 'black',
      strokeOpacity = 1,
      lineFill = 'transparent',
    } = this.props;

    if (!nodeMap || !this._svgContainer) {
      return null;
    }

    this._paths = [];
    const containerTop = this._svgContainer.getBoundingClientRect().top;

    return nodeMap.map((node, index) => {
      if (index < nodeMap.length - 1) {
        const nextNode = nodeMap[index + 1];
        const startPosX = node.width / 2;
        const startPosY = (node.top - containerTop) + node.height;
        const endPosX = nextNode.width / 2;
        const endPosY = Math.round(startPosY + (nextNode.top - node.top - nextNode.height));
        console.log('nextNode', nextNode.top, nextNode.height);
        const d = `M${startPosX},${startPosY} ${endPosX},${endPosY}`;

        return (
          <path
            key={shortId.generate()}
            d={d}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            opacity={strokeOpacity}
            fill={lineFill}
            ref={(path) => {
              this._paths.push(path);
            }}
          />
        );
      }
    });
  }

  render() {
    const connectors = this._drawLines();
    return (
      <svg
        ref={(container) => {
          this._svgContainer = container;
        }}
        className="rec-svg-overlay"
      >
        { connectors }
      </svg>
    );
  }
}

Connectors.propTypes = {};
