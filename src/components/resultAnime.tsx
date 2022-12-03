import React, { useEffect } from 'react'
import styles from './resultAnime.module.css';

//検索ボックスのコンポーネント
//デザインの変更をしたい

//@param pushFlag - 検索ボタンが押されたかどうかのフラグ
//@return フラグがtrueの場合 - 結果画面を表示
//@return フラグがfalseの場合 - 何も表示しない

type Props = {
  pushCount:number
  likeList:Array<string>
}

const ResultAnime: React.FC<Props> = ({pushCount,likeList}) => {
    let clsname = styles.Hidden;
    if (pushCount > 0) {
        clsname = styles.Display;
    }
    console.log(likeList)
    useEffect(() => {
      const access_api = async(param:string) => {
        const response = await fetch(`https://dev-recoani-d6gutf2s.onrender.com/api/recommend/overall${param}`,{
          method:'GET',})
          if (!response.ok){
            const err = await response.json()
            throw new Error(err)
          }
        const data = await response.json();
        const recommendAnimeList = data.data;
        console.log(recommendAnimeList)
      }
      if (likeList.length !== 0){
        let param = "?"
        for (const id of likeList){
          param += "user_likes=" + id + "&"
        }
        param = param.slice(0,-1)
        access_api(param);
      }
      },[pushCount])
  return (
      <div className={clsname}>
        結果を表示するよん
      </div>
  );
};

export default ResultAnime