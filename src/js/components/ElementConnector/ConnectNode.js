import { Component, PropTypes } from 'react';

export default class ConnectNode extends Component {
  render() {
    const { children = null } = this.props;
    return (
      <div {...this.props}>
        { children }
      </div>
    );
  }
}

Node.propTypes = {
  children: PropTypes.node
};
