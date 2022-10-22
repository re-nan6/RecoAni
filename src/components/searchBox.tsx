import React from 'react'
import styles from './searchBox.module.css';

//検索ボックスのコンポーネント
//デザインの変更をしたい

//@param onChange - 検索ボックスの内容が変更された場合に実行される関数
//@return テキストボックスが表示される

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