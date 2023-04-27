import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import Notiflix from 'notiflix';
import css from './Searchbar.module.css';

const Searchbar = ({ onSubmit }) => {
  const [inputSearch, setInputSearch] = useState('');

  const handleInputChange = event => {
    setInputSearch(event.target.value.toLowerCase());
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (inputSearch.trim() === '') {
      return Notiflix.Notify.warning(
        'Please, type what images do you want to find =)'
      );
    }
    onSubmit(inputSearch);
    setInputSearch('');
  };

  return (
    <header className={css.Searchbar}>
      <form onSubmit={handleSubmit} className={css.SearchForm}>
        <button type="submit" className={css.SearchFormButton}>
          <FaSearch />
          <span className={css.SearchFormButtonLabel}>Search</span>
        </button>

        <input
          onChange={handleInputChange}
          className={css.SearchFormInput}
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={inputSearch}
        />
      </form>
    </header>
  );
};

export default Searchbar;
