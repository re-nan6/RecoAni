import React from 'react'
import styles from './title.module.css';

//サイトタイトルのコンポーネント
//フォント・サイズの設定したい
//ロゴとかもほしいかも

//@return サイトのタイトルが表示される

type Props = {

}

const Title: React.FC<Props> = () => {
  return (
      <div className={styles.logo}>
         アニメレコメンド！
      </div>
  );
};

export default Title