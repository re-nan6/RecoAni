import React from 'react'
import styles from './searchBox.module.css';

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBox: React.FC<Props> = ({onChange}) => {
  return (
      <div className={styles.box}>
        <input type="text" placeholder="キーワードを入力" onChange={e => onChange(e)}/>
      </div>
  );
};

export default SearchBox