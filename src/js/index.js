import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './container/App';

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./container/App', () => {
    const newApp = require('./container/App').default;
    render(newApp);
  });
}
