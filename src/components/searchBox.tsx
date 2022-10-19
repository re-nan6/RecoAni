import React from 'react'
import styles from './searchBox.module.css';

type Props = {
  setAnime:React.Dispatch<React.SetStateAction<string>>
}

const SearchBox: React.FC<Props> = ({setAnime}) => {
  return (
      <div className={styles.Box}>
         <input type="text" placeholder="キーワードを入力" onChange={e => setAnime(e.target.value)}/>
      </div>
  );
};

export default SearchBox