import { Component, PropTypes, Children, cloneElement } from 'react';
import { findDOMNode } from 'react-dom';
import Connectors from './Connectors';

export default class Workspace extends Component {
  constructor(props) {
    super(props);
    this._calculatePositions = this._calculatePositions.bind(this);
    this.state = {
      nodeMap: null
    };
  }

  componentDidMount() {
    this._calculatePositions();
  }

  _calculatePositions() {
    const { children } = this.props;
    const nodeMap = [];

    Object.keys(this.refs)
      .forEach((key) => {
        const boundingBox = findDOMNode(this.refs[key]).getBoundingClientRect();
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

  render() {
    const { children } = this.props;
    return (
      <div className="rec-workspace">
        <Connectors nodeMap={this.state.nodeMap} />
        {Children.map(children, (child, key) => {
          return cloneElement(child, {
            ref: `node-${key}`
          });
        })}
      </div>
    );
  }
}

Workspace.propTypes = {
  children: PropTypes.node
};
