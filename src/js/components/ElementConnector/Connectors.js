import { Component, PropTypes, createElement } from 'react';
import shortId from 'short-id';

export default class Connectors extends Component {
  constructor(props) {
    super(props);
    this._drawLines = this._drawLines.bind(this);
    this._animateLines = this._animateLines.bind(this);
    this._animatePath = this._animatePath.bind(this);
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

  _animatePath(path, delayQueue, reverse = false) {
    const { animate, animationDuration, animationEasing } = this.props;
    const length = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = `${length} ${length}`;
    if (reverse) {
      path.style.strokeDashoffset = 0 - length;
    } else {
      path.style.strokeDashoffset = length;
    }
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${animationDuration / 1000}s ${animationEasing}`;
    setTimeout(() => {
      path.style.strokeDashoffset = 0;
    }, delayQueue);
  }

  _animateLines(startIndex = 0) {
    const { animate, animationDelay, animationDuration } = this.props;

    if (!this._svgContainer || !animate || !this._paths.length) {
      return false;
    }

    let delayQueue = animationDelay;
    const validPaths = this._paths.filter(Boolean);

    validPaths.forEach((path, index) => {
      if (index >= startIndex) {
        if (Array.isArray(path)) {
          path.forEach((p, index) => {
            const reverse = !(index === 0 || index % 2 === 0);
            this._animatePath(p, delayQueue, reverse);
          });
        } else {
          this._animatePath(path, delayQueue);
        }
      }

      delayQueue += animationDuration;
    });
  }

  _drawLines() {
    const { nodeMap = null, strokeWidth, strokeColor, strokeOpacity, lineFill } = this.props;

    if (!nodeMap || !this._svgContainer) {
      return null;
    }

    this._paths = [];
    const containerTop = this._svgContainer.getBoundingClientRect().top;

    return nodeMap.map((node, index) => {
      if (index < nodeMap.length - 1 && node.element.tagName !== 'svg') {
        const nextNode = nodeMap[index + 1];
        const startPosX = node.width / 2;
        const endPosX = nextNode.width / 2;
        const startPosY = (node.top - containerTop) + node.height;
        const endPosY = nextNode.top - containerTop;
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
              this._paths[index] = path;
            }}
          />
        );
      } else if (node.element.tagName === 'svg') {
        let path = [];
        if (node.element.children.length) {
          if (node.element.children.length === 2
            && ['circle', 'rect'].indexOf(node.element.children[0].tagName) > -1
            && ['circle', 'rect'].indexOf(node.element.children[1].tagName) > -1) {
              path = [];
              path.push(node.element.children[0], node.element.children[1]);
            } else {
              path = node.element.children[0];
            }
        }
        if (path) {
          this._paths[index] = path;
        }
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
