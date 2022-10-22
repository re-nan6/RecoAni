import React from 'react'
import styles from './searchButton.module.css';

//検索ボタンのコンポーネント
//デザインを変更したい

//@return 検索ボタンが表示される

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