import React, { useEffect, useState } from 'react'
import {gql, useLazyQuery, DocumentNode} from '@apollo/client';
import styles from './resultAnime.module.css';
import RecommendCard from './recommendCard'
import { title } from 'process';
//検索ボックスのコンポーネント
//デザインの変更をしたい

//@param pushCount - 検索ボタンが押された回数
//@param likelist - ユーザーが選択したアニメのIDを格納したリスト
//@return フラグがtrueの場合 - 結果画面を表示
//@return フラグがfalseの場合 - 何も表示しない

type Props = {
  pushCount:number
  likeList:Array<string>
}

interface recommendInterface {
  annictId:number;
  score:number;
}

interface animeInterface{
  __typename: string
  annictId:number
  malAnimeId:string
  officialSiteUrl:string
  title: string
  twitterUsername: string
  media: string
  wikipediaUrl:string
}

const ResultAnime: React.FC<Props> = ({pushCount,likeList}) => {
    let clsname = styles.Hidden;
    const [animeList,setAnimeList] = useState<Array<animeInterface>>([]);
    const [SEARCH_ANIME,setSEARCH_ANIME] = useState<DocumentNode>(gql`
    query {
      searchWorks(
        annictIds: []
      ) {
          nodes {
            annictId
            malAnimeId
            officialSiteUrl
            title
            twitterUsername
            media
            wikipediaUrl
        }
      }
    }
    `);
    //graphQLでannictAPIを適宜呼び出すためのもの
    const [inputAnime, { called, loading, error, data }] = useLazyQuery(SEARCH_ANIME);
    //テキストボックスに入力された文字列を元にqueryを作成
    const search = (recommendAnimeList:Array<recommendInterface>) => {
      let ids:Array<number> = [];
      for (const anime of recommendAnimeList){
        ids.push(anime.annictId)
      }
      setSEARCH_ANIME(gql`
      query {
        searchWorks(
          annictIds: [${ids}]
        ) {
            nodes {
              annictId
              malAnimeId
              officialSiteUrl
              title
              twitterUsername
              media
              wikipediaUrl
          }
        }
      }
      `)
    }
    if (pushCount > 0) {
        clsname = styles.Display;
    }
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
        search(recommendAnimeList);
        inputAnime();
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
    //検索した結果出てきたアニメの情報をリストに格納してる
    const makeAnimeList = () => {
      if (data) {
        console.log(data)
        const li = [];
        for (let i = 0; i < data.searchWorks.nodes.length; i++){
          li.push(data.searchWorks.nodes[i]);
        }
        setAnimeList(li);
        console.log(animeList)
      }
    }

    //data(graphQLの実行結果)の値が変わる度にmakeAnimeList関数が実行される
    useEffect(makeAnimeList,[data])
  return (
      <div className={clsname}>
        <div className='animes'>
            {animeList.map((info,index) => {
              return (
                <RecommendCard annictId={info.annictId} title={info.title} malAnimeId={info.malAnimeId} officialSiteUrl={info.officialSiteUrl} twitterUsername={info.twitterUsername} wikipediaUrl={info.wikipediaUrl}/>
            )})}
          </div>
      </div>
  );
};

export default ResultAnime