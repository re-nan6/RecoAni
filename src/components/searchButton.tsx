import React from 'react'
import styles from './searchButton.module.css';

//検索ボタンのコンポーネント
//デザインを変更したい

//@return 検索ボタンが表示される

type Props = {
  onClick:() => void[];
}

const SearchButton: React.FC<Props> = ({onClick}) => {
  return (
    <div>
      <button className={styles.btn} onClick={onClick}>おすすめのアニメを検索</button>
    </div>
  );
};

export default SearchButton