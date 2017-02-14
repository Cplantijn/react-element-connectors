import { Component } from 'react';
import { Workspace, ConnectNode } from '../components/ElementConnector';

export default class App extends Component {
  constructor() {
    super();
    this._generateNodes = this._generateNodes.bind(this);
    this.state = {
      nodes: [1, 2, 3, 4]
    };
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({
    //     nodes: [1, 2, 3, 4, 5, 6]
    //   })
    // }, 3000)
  }

  _generateNodes() {
    return this.state.nodes.map((node) => {
      return (
        <ConnectNode
          key={shortId.generate()}
        >
        Hey
        </ConnectNode>
      );
    })
  }
  render() {
    // const nodes = this._generateNodes();
    return (
      <Workspace>
        <div className="rec-node"><span>Hey</span></div>
        <ConnectNode style={{background:'red'}}>
          <h1>Test</h1>
        </ConnectNode>
        <ConnectNode style={{background:'red'}}>
          <span style={{display: 'block', width: '100%'}}>Hey</span>
        </ConnectNode>
        <ConnectNode style={{background:'red'}}>
          <h1>Test</h1>
        </ConnectNode>
        <div id="outsider" style={{background:'red'}}>
          <ConnectNode id="out-connect">
            <div style={{display:'block'}}>
              <div>
                <h1>Test Out</h1>
              </div>
            </div>
          </ConnectNode>
        </div>
      </Workspace>
    );
  }
}
