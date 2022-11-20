import React, { useEffect } from 'react'
import styles from './animeCard.module.css';
import {Img} from 'react-image';
import { useState } from 'react';
import { CgWebsite } from 'react-icons/cg';
import { FaTwitter } from 'react-icons/fa';
import { METHODS } from 'http';

//アニメカードのコンポーネント
//画像リンクが存在しない場合・リンクが無効の場合の例外処理実装したい
//アニメタイトルが長すぎる場合にアニメを識別するのが難しい→ホバーしたときタイトル名をフルで表示する？

//@param annictID - アニメを一意に紐づけするID
//@param malAnimeId - myanimelistのID
//@param recommendImgUrl - アニメ画像のURL その１
//@param facebookImgUrl - アニメ画像のURL その２
//@param officialSiteUrl - 公式サイトのURL
//@param media - 放送媒体
//@param animeTitle - そのアニメのタイトル
//@param value - そのラベルが持つ値
//@param onChange - そのアニメカードが選択されたときに行う処理
//@param checked - 選択されているかいないかのフラッグ
//@return 画像URLが存在する場合 - そのままアニメカードが表示される
//@return 画像URLが存在しない場合 - NoImageと書かれた画像を表示させる(予定)

type Props = {
  annictID:number;
  malAnimeId:string;
  recommendImgUrl:string;
  facebookImgUrl:string;
  officialSiteUrl:string;
  media:string;
  animeTitle:string;
  twitterUsername:string;
  value:string;
  onChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
  checked:boolean;
}

const AnimeCard: React.FC<Props> = ({annictID,malAnimeId,recommendImgUrl,facebookImgUrl,officialSiteUrl,media,animeTitle,twitterUsername,value,onChange,checked}) => {
  const [imgUrl,setImgUrl] = useState<string>(`${process.env.PUBLIC_URL}/noimage.png`)

  useEffect(() => {
    const access_api = async() => {
      const response = await fetch(`https://api.jikan.moe/v4/anime/${malAnimeId}/pictures`,{method:'GET'})
      const data = await response.json();
      console.log(data.data)
      if (typeof data.data === 'string'){
        setImgUrl(data.data)
      }else if (typeof data.data === 'undefined'){
        setImgUrl(`${process.env.PUBLIC_URL}/noimage.png`)
      }
      else{
        setImgUrl(data.data[0].jpg.image_url)
      }
    }
    access_api();
    },[malAnimeId])

  // console.log(imgUrl)
  // let imgUrl = facebookImgUrl;
  // if (imgUrl === ''){
  //   imgUrl = recommendImgUrl;
  // }
  const ID = String(annictID);
  const twitterLink = `https://twitter.com/${twitterUsername}`;
  const noImage = `${process.env.PUBLIC_URL}/noimage.png`
  return (
    <div className={styles.anime}>
      <a className={styles.site} href={officialSiteUrl} rel="noreferrer" target="_blank">
        <span className={styles.siteicon}><CgWebsite size={15}/></span>
        <span className={styles.sitename}>公式サイト</span>
      </a>
      <a className={styles.twitter} href={twitterLink} rel="noreferrer" target="_blank">
        <FaTwitter/>
      </a>
      <input type="checkbox" id={ID} value={value} onChange={onChange} checked={checked}/>
      <label htmlFor={ID}>
        <div>
          <img className={styles.ogp} loading='lazy' src={imgUrl} onError={(e) => {e.currentTarget.src = noImage}}/>
        </div>
        <div className={styles.title}>
          <span className={styles.media}>{media}</span>
          <span className={styles.titleName}>{animeTitle}</span>
        </div>
        <div className={`${styles.LikesIcon} ${styles.HeartAnimation}`}></div>
      </label>
      </div>
  );
};

export default AnimeCard