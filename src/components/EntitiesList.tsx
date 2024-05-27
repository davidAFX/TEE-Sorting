import * as elements from 'typed-html';
import { notReact } from '../notReact';

const EntitiesList = () => {
  const [entities, setEntities] = notReact.useState([]);
  notReact.useEffect(() => {
    fetch('./data/entities.json')
      .then((response) => response.json())
      .then((data) => setEntities(data));
  }, []);

  console.log(entities);
  return (
    <div>
      {/* <h1>Counter: {count}</h1>
      <button id="increaseCount">Increase count</button>
      <p>
        Is the count higher than 5? <strong>{isHigherThan5}!</strong>
      </p> */}
    </div>
  );
};

export default EntitiesList;
