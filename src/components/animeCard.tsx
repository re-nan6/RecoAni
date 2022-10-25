import { request } from 'https';
import React from 'react'
import styles from './animeCard.module.css';

//アニメカードのコンポーネント
//画像リンクが存在しない場合・リンクが無効の場合の例外処理実装したい
//アニメタイトルが長すぎる場合にアニメを識別するのが難しい→ホバーしたときタイトル名をフルで表示する？

//@param annictID - アニメを一意に紐づけするID
//@param animeUrl - アニメ画像のURL
//@param media - 放送媒体
//@param animeTitle - そのアニメのタイトル
//@param value - そのラベルが持つ値
//@param onChange - そのアニメカードが選択されたときに行う処理
//@param checked - 選択されているかいないかのフラッグ
//@return 画像URLが存在する場合 - そのままアニメカードが表示される
//@return 画像URLが存在しない場合 - NoImageと書かれた画像を表示させる(予定)

type Props = {
  annictID:number;
  animeUrl:string;
  media:string;
  animeTitle:string;
  value:string;
  onChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
  checked:boolean;
}


const AnimeCard: React.FC<Props> = ({annictID,animeUrl,media,animeTitle,value,onChange,checked}) => {
  if (animeUrl === ''){
    animeUrl = `${process.env.PUBLIC_URL}/noimage.png`;
  }

  const ID = String(annictID);
  return (
    <div className={styles.anime}>
      <input type="checkbox" id={ID} value={value} onChange={onChange} checked={checked}/>
      <label htmlFor={ID}>
        <div className='colorfilter'>
          <img className={styles.ogp} loading='lazy' src={animeUrl}/>
        </div>
        <div className={styles.title}>
          <span className={styles.media}>{media}</span>
          <span className={styles.titleName}>{animeTitle}</span>
        </div>
      </label>
    </div>
  );
};

export default AnimeCard