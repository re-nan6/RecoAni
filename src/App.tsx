import React from 'react';
import {useState, useEffect} from 'react';
import './App.css';
import SiteTitle from './components/siteTitle';
import Anime from './anime.json';
import SearchBox from './components/searchBox';
import SearchButton from './components/searchButton';
import AnimeCard from './components/animeCard';
import ResultAnime from './components/resultAnime';
import {gql, useLazyQuery, DocumentNode} from '@apollo/client';
import { MdDeleteForever } from 'react-icons/md'

function App() {

  //annictAPIから受け取れるjsonファイルの中身の型定義の一部
  interface imageInterface {
    __typename:string
    facebookOgImageUrl:string
    recommendedImageUrl:string
  }

  //annictAPIから受け取れるjsonファイルの中身の型定義
  interface animeInterface{
    __typename: string
    annictId:number
    officialSiteUrl:string
    title: string
    twitterUsername: string
    media: string
    image: imageInterface | null
  }

  //検索前に表示するアニメのリストを作成
  const initial_anime = [];
  for (let i = 0; i < Anime.searchWorks.nodes.length; i++){
    initial_anime.push(Anime.searchWorks.nodes[i]);
  }

  //レコメンド結果表示に必要なフラグの定義
  const [flag,setFlag] = useState<boolean>(false);

  //アニメカードの表示に必要な変数の定義
  //とりあえず初期値はテキトーなので直す余地あり
  const [animeList,setAnimeList] = useState<Array<animeInterface>>(initial_anime);
  const [val,setVal] = useState<Array<string>>([]);
  const [SEARCH_ANIME,setSEARCH_ANIME] = useState<DocumentNode>(gql`
  query {
    searchWorks(
      orderBy: { field: WATCHERS_COUNT, direction: DESC },
      first: 10,
      titles: []
    ) {
        nodes {
          annictId
          officialSiteUrl
          title
          twitterUsername
          media
          image{
            facebookOgImageUrl
            recommendedImageUrl
          }
      }
    }
  }
  `);

  //graphQLでannictAPIを適宜呼び出すためのもの
  const [inputAnime, { called, loading, error, data }] = useLazyQuery(SEARCH_ANIME);

  //テキストボックスに入力された文字列を元にqueryを作成
  const search = (value:string) => {
    setSEARCH_ANIME(gql`
    query {
      searchWorks(
        orderBy: { field: WATCHERS_COUNT, direction: DESC },
        first: 10,
        titles: ["${value}"]
      ) {
          nodes {
            annictId
            officialSiteUrl
            title
            twitterUsername
            media
            image{
              facebookOgImageUrl
              recommendedImageUrl
            }
        }
      }
    }
    `)
  }

  //テキストボックスの中身が変わるたびにこの関数が実行される
  //queryの定義とannictAPIの使用
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
    inputAnime();
  }

  //選択しているアニメカードを管理している
  const valChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (val.includes(e.target.value)) {
      setVal(val.filter(item => item !== e.target.value));
    }else {
      setVal([...val,e.target.value]);
    }
  }

  //選択しているアニメカードを管理している(削除ボタンで削除可能)
  const valChangeBtn = (e:React.MouseEvent<HTMLButtonElement>) => {
    if (val.includes(e.currentTarget.value)) {
      setVal(val.filter(item => item !== e.currentTarget.value));
    }else {
      setVal([...val,e.currentTarget.value]);
    }
  }

  //選択されたアニメ一覧を表示する
  //確認用なので後で消す
  const valDisplay = () => [
    setFlag(true)
  ]

  //検索した結果出てきたアニメの情報をリストに格納してる
  const makeAnimeList = () => {
    if (data) {
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


  //なんかページ読み込んだタイミングで何もアニメカードが表示されないから直したい
  return (
    <div className='App'>
      <div className="main">
        <SiteTitle/>
        <SearchBox onChange={(e) => handleChange(e)}/>
        <div className='animebox'>
          <div className='animes'>
            {animeList.map((info,index) => {
              return (
                info.image?
                (<AnimeCard annictID={info.annictId} recommendImgUrl={info.image.recommendedImageUrl} facebookImgUrl={info.image.facebookOgImageUrl} officialSiteUrl={info.officialSiteUrl} media={info.media} animeTitle={info.title} twitterUsername={info.twitterUsername} value={info.title} onChange={valChange} checked={val.includes(info.title)}/>)
                :(<AnimeCard annictID={info.annictId} recommendImgUrl='' facebookImgUrl='' officialSiteUrl={info.officialSiteUrl}  media={info.media} animeTitle={info.title} twitterUsername={info.twitterUsername} value={info.title} onChange={valChange} checked={val.includes(info.title)}/>)
                )
            })}
          </div>
        </div>
        <div>
          現在選択中のアニメ
        </div>
        <div>
          <ul>
            {val.map((title) =>
            <li value={title}>
              {title}
              <button className="deleteBtn" onClick={valChangeBtn} value={title}>
                <MdDeleteForever className='deleteIcon'/>
              </button>
            </li>
            )}
          </ul>
        </div>
        <SearchButton onClick={valDisplay}/>
        <ResultAnime pushFlag={flag}/>
      </div>
    </div>
  );
}

export default App;
