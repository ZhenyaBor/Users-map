import { useMemo, useState } from 'react';
import './App.css';
import UsersMap from './components/UsersMap/UserMap';
import { useDebounce } from './hooks/useDebounce';

function App() {
  const [interestQuery, setInterestQuery] = useState('');
  const debouncedQuery = useDebounce(interestQuery);
  const filterValue = useMemo(() => debouncedQuery.trim().toLowerCase(), [debouncedQuery]);

  return (
    <div className='app'>
      <header className='app__header'>
        <div>
          <p className='eyebrow'>Пошук однодумців</p>
          <h1>Інтерактивна мапа користувачів</h1>
          <p className='subtitle'>
            Фільтруйте за інтересами, збільшуйте кластери та знаходьте людей поруч.
          </p>
        </div>
        <label className='filter'>
          <span>Фільтр за інтересом</span>
          <input
            type='search'
            placeholder='Ваш інтерес (music, react...)'
            value={interestQuery}
            onChange={(event) => setInterestQuery(event.target.value)}
          />
        </label>
      </header>

      <main className='app__map'>
        <UsersMap interestFilter={filterValue} />
      </main>
    </div>
  );
}

export default App;
