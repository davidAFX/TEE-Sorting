import * as elements from 'typed-html';
import EntitiesList from './components/EntitiesList';
const App = () => {
  return (
    <div id="sorting-wrapper">
      <div id="entities-wrapper">{EntitiesList()}</div>
    </div>
  );
};

export default App;
