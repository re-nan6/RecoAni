import React, { useEffect, useState } from 'react';
import { gql, useLazyQuery, DocumentNode } from '@apollo/client';
import styles from './resultAnime.module.css';
import RecommendCard from './recommendCard';

//レコメンド結果一覧を表示するためのコンポーネント
//何も選択していない場合にレコメンド結果を表示しないように例外処理してない？

//@param pushCount - 検索ボタンが押された回数
//@param likelist - ユーザーが選択したアニメのIDを格納したリスト
//@return フラグがtrueの場合 - 結果画面を表示
//@return フラグがfalseの場合 - 何も表示しない

type Props = {
  pushCount: number;
  likeList: Array<string>;
}

//自作APIから受け取れるjsonファイルの型定義
interface recommendInterface {
  annictId: number;
  score: number;
}

//annictAPIから受け取れるjsonファイルの中身の型定義の一部
interface imageInterface {
  __typename: string;
  facebookOgImageUrl: string | undefined;
  recommendedImageUrl: string | undefined;
}

//annictAPIから受け取れるjsonファイルの中身の型定義
interface animeInterface {
  __typename: string;
  annictId: number;
  malAnimeId: string;
  officialSiteUrl: string;
  title: string;
  twitterUsername: string;
  media: string;
  wikipediaUrl: string;
  seasonName: string;
  seasonYear: number;
  image: imageInterface;
}

const ResultAnime: React.FC<Props> = ({ pushCount, likeList }) => {
  let clsname = styles.Hidden;
  const [animeList, setAnimeList] = useState<Array<animeInterface>>([]);
  const [SEARCH_ANIME, setSEARCH_ANIME] = useState<DocumentNode>(gql`
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
              seasonName
              seasonYear
              image{
                facebookOgImageUrl
                recommendedImageUrl
              }
          }
        }
      }
      `);
  //graphQLでannictAPIを適宜呼び出すためのもの
  const [inputAnime, { data }] = useLazyQuery(SEARCH_ANIME);
  //テキストボックスに入力された文字列を元にqueryを作成
  const search = (recommendAnimeList: Array<recommendInterface>) => {
    let ids: Array<number> = [];
    for (const anime of recommendAnimeList) {
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
                seasonName
                seasonYear
                image{
                  facebookOgImageUrl
                  recommendedImageUrl
                }
            }
          }
        }
        `)
  }
  //ボタンを１回以上押した場合に結果を表示
  if (pushCount > 0) {
    clsname = styles.Display;
  }
  //おすすめのアニメを取得するためのAPIを実行
  useEffect(() => {
    const access_api = async (param: string) => {
      const response = await fetch(`${process.env.REACT_APP_RECOANI_API_URL}/recommend/overall${param}`, {
        method: 'GET', headers: { Accept: "application/json" },
      })
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err);
      }
      const data = await response.json();
      const recommendAnimeList = data.data;
      search(recommendAnimeList);
      inputAnime();
    }
    if (likeList.length !== 0) {
      let param = "?"
      for (const id of likeList) {
        param += "user_likes=" + id + "&";
      }
      param = param.slice(0, -1);
      access_api(param);
    }
  }, [pushCount, inputAnime, likeList])

  //検索した結果出てきたアニメの情報をリストに格納してる
  const makeAnimeList = () => {
    if (data) {
      const li = [];
      for (let i = 0; i < data.searchWorks.nodes.length; i++) {
        li.push(data.searchWorks.nodes[i]);
      }
      setAnimeList(li);
    }
  }

  //data(graphQLの実行結果)の値が変わる度にmakeAnimeList関数が実行される
  useEffect(makeAnimeList, [data])
  return (
    <div className={clsname}>
      {animeList.map((info) => {
        return (
          <RecommendCard annictId={info.annictId} title={info.title} malAnimeId={info.malAnimeId} officialSiteUrl={info.officialSiteUrl} twitterUsername={info.twitterUsername} wikipediaUrl={info.wikipediaUrl} recommendImgUrl={info.image.recommendedImageUrl} facebookImgUrl={info.image.facebookOgImageUrl} seasonName={info.seasonName} seasonYear={info.seasonYear} />
        )
      })}
    </div>
  );
};

export default ResultAnime