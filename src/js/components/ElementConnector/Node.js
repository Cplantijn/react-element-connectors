import { Component, PropTypes } from 'react';

export default class Node extends Component {
  render() {
    const { children = null } = this.props;
    return (
      <div className="rec-node">
        { children }
      </div>
    );
  }
}

Node.propTypes = {
  children: PropTypes.node
};
