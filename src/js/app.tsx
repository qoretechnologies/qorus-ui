//import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import Routes from './routes';
import reduxStore from './store';

require('normalize.css/normalize.css');
//require('@blueprintjs/core/lib/css/blueprint.css');
require('../fonts/Roboto.ttf');
require('../fonts/Roboto-Regular.ttf');
require('../fonts/NeoLight.ttf');
require('../css/app.scss');

const App: Function = () => (
  <Provider store={reduxStore}>
    <div className="app__wrap">
      <Routes routerProps={{ history: browserHistory }} />
    </div>
  </Provider>
);

export default App;
