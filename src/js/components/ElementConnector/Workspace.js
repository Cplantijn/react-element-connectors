import { Component, PropTypes, Children, cloneElement, isValidElement } from 'react';
import { findDOMNode } from 'react-dom';
import Connectors from './Connectors';
import shortId from 'short-id';
import Resizable from 'react-component-resizable';

export default class Workspace extends Component {
  constructor(props) {
    super(props);
    this._calculatePositions = this._calculatePositions.bind(this);
    this.state = {
      nodeMap: null
    };
  }

  _calculatePositions() {
    const { children } = this.props;
    const nodeMap = [];

    Object.keys(this.refs)
      .forEach((key) => {
        const boundingBox = findDOMNode(this.refs[key]).getBoundingClientRect();
        let id = 'connect';

        if (this.refs[key].props.id) {
          id = this.refs[key].props.id;
        }
        console.log(id, boundingBox)
        nodeMap.push({
          key,
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
    return Children.map(children, (child, key) => {
      if (isValidElement(child)) {
        let newProps = {};

        if (child.type.displayName === 'ConnectNode') {
          newProps = { ref: shortId.generate() };
        } else if (child.props.children) {
          newProps.children = this._recursiveCloneChildren(child.props.children);
        }
        return cloneElement(child, newProps);
      }
      return child;
    });
  }

  render() {
    const { children } = this.props;
    const renderedChildren = this._recursiveCloneChildren(children);
    return (
      <Resizable
        className="rec-workspace"
        onResize={this._calculatePositions}
      >
        <Connectors
          animate
          animationDuration={360}
          animationEasing="linear"
          strokeWidth={1}
          nodeMap={this.state.nodeMap}
        />
        { renderedChildren }
      </Resizable>
    );
  }
}

Workspace.propTypes = {
  children: PropTypes.node
};
