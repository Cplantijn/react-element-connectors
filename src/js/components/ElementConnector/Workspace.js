import { Component, PropTypes, Children, cloneElement, isValidElement } from 'react';
import Resizable from 'react-component-resizable';
import Connectors from './Connectors';

export default class Workspace extends Component {
  constructor(props) {
    super(props);
    this._calculatePositions = this._calculatePositions.bind(this);
    this._nodes = [];
    this.state = {
      nodeMap: null
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._calculatePositions);
    this._calculatePositions();
  }

  componentWillUmount() {
    window.removeEventListener('resize', this._calculatePositions);
  }

  _calculatePositions() {
    const nodeMap = [];

    this._nodes.forEach((node) => {
      const boundingBox = node.getBoundingClientRect();
      nodeMap.push({
        element: node,
        top: boundingBox.top,
        left: boundingBox.left,
        height: boundingBox.height,
        width: boundingBox.width
      });
    });

    this.setState({
      nodeMap
    });
  }

  _recursiveCloneChildren(children) {
    return Children.map(children, (child) => {
      if (isValidElement(child)) {
        let newProps = {};

        if (child.type.displayName === 'ConnectNode') {
          newProps = {
            ref: (c) => {
              if (c && c._node) {
                if (c._svgContainer) {
                  this._nodes.push(c._svgContainer);
                }
                this._nodes.push(c._node);
              }
            }
          };
        } else if (child.props.children) {
          newProps.children = this._recursiveCloneChildren(child.props.children);
        }

        return cloneElement(child, newProps);
      }
      return child;
    });
  }

  render() {
    const {
      children,
      animationDelay = 0,
      animationDuration = 1000,
      animationEasing = 'ease-in-out',
      strokeWidth = 1,
      strokeColor = '#000',
      strokeOpacity = 1,
      animate = true
    } = this.props;

    this._nodes = [];
    const renderedChildren = this._recursiveCloneChildren(children);
    return (
      <div className="rec-workspace">
        <Connectors
          nodeMap={this.state.nodeMap}
          animationDelay={animationDelay}
          animationDuration={animationDuration}
          animationEasing={animationEasing}
          strokeWidth={strokeWidth}
          strokeColor={strokeColor}
          animate={animate}
        />
        { renderedChildren }
      </div>
    );
  }
}

Workspace.propTypes = {
  children: PropTypes.node
};
