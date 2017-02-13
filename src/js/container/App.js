import { Component } from 'react';
import { Workspace, Node } from '../components/ElementConnector';

export default class App extends Component {
  render() {
    return (
      <Workspace>
        <Node>
          <h1>Test 1</h1>
        </Node>
        <Node>
          <h1>Test 2</h1>
        </Node>
      </Workspace>
    );
  }
}
