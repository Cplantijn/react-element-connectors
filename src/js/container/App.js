import { Component } from 'react';
import { Workspace, ConnectNode } from '../components/ElementConnector';

export default class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Workspace>
        <div><ConnectNode><span style={{display: 'block'}}>Hey</span></ConnectNode></div>
        <ConnectNode drawOutline>
          <h1>Test</h1>
        </ConnectNode>
        <ConnectNode drawOutline outlineShape="box">
          <h1>Test</h1>
        </ConnectNode>
        <div id="outsider">
          <ConnectNode drawOutline id="out-connect">
            <div style={{ display:'block' }}>
              <span>Hey</span>
            </div>
          </ConnectNode>
        </div>
        <ConnectNode drawOutline>
          <h1>Test</h1>
        </ConnectNode>
      </Workspace>
    );
  }
}
