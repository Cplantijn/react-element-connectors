import { Component, PropTypes, Children, cloneElement, isValidElement } from 'react';
import $ from 'jquery';
import classnames from 'classnames';
import Connectors from './Connectors';

export default class Workspace extends Component {
  constructor(props) {
    super(props);
    this._calculatePositions = this._calculatePositions.bind(this);
    this._nodes = [];
    this._workspace = null;
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

  componentDidUpdate(oldProps) {
    if (oldProps.children.length !== this.props.children.length) {
      this._calculatePositions();
    }
  }

  _calculatePositions() {
    const { startAnchor = null } = this.props;
    const nodeMap = [];
    if (startAnchor) {
      nodeMap.push({
        element: this._workspace,
        top: $(this._workspace).offset().top,
        left: $(this._workspace).offset().left,
        height: $(this._workspace).outerHeight(),
        width: $(this._workspace).outerWidth(),
        startAnchor
      });
    }

    this._nodes.forEach((node) => {
      nodeMap.push({
        element: node,
        top: $(node).offset().top,
        left: $(node).offset().left,
        height: $(node).outerHeight(),
        width: $(node).outerWidth(),
        startAnchor: null
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
        if (child.type.name === 'ConnectNode') {
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
      Component = 'div',
      animationDelay = 0,
      animationDuration = 460,
      className,
      animationEasing = 'ease-in-out',
      strokeWidth = 2,
      strokeColor = '#888',
      strokeOpacity = 1,
      animate = true
    } = this.props;

    const cls = classnames({
      'rec-workspace': true
    }, className)
    this._nodes = [];
    const renderedChildren = this._recursiveCloneChildren(children);
    return (
      <Component
        ref={w => this._workspace = w}
        className={cls}>
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
      </Component>
    );
  }
}

Workspace.propTypes = {
  children: PropTypes.node
};
