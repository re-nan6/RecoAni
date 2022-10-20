import React from 'react'
import styles from './searchButton.module.css';

type Props = {

}

const SearchButton: React.FC<Props> = () => {
  return (
    <div>
      <button className={styles.btn}>おすすめのアニメを検索</button>
    </div>
  );
};

export default SearchButton