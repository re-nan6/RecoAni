import React from 'react'
import styles from './resultAnime.module.css';

//検索ボックスのコンポーネント
//デザインの変更をしたい

//@param pushFlag - 検索ボタンが押されたかどうかのフラグ
//@return フラグがtrueの場合 - 結果画面を表示
//@return フラグがfalseの場合 - 何も表示しない

type Props = {
  pushFlag:boolean
}

const ResultAnime: React.FC<Props> = ({pushFlag}) => {
    let clsname = styles.Hidden;
    if (pushFlag) {
        clsname = styles.Display;
    }
  return (
      <div className={clsname}>
        結果を表示するよん
      </div>
  );
};

export default ResultAnime