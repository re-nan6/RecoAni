import React from 'react';
import {useState, useEffect} from 'react';
import './App.css';
import SiteTitle from './components/siteTitle';
import Anime from './anime.json';
import SearchBox from './components/searchBox';
import SearchButton from './components/searchButton';
import Sidebar from './components/sidebar';
import MalCard from './components/malCard';
import ResultAnime from './components/resultAnime';
import {gql, useLazyQuery, DocumentNode} from '@apollo/client';
import { MdDeleteForever } from 'react-icons/md';
import { AppShell, Navbar, Header, Pagination } from '@mantine/core';
import _ from 'lodash';

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
    malAnimeId:string
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
  const [pushCount,setPushCount] = useState<number>(0);

  const [numPage,setNumPage] = useState<number>(0);
  const [nowPage,setNowPage] = useState<number>(1);
  const [displayAnimeList,setDisplayAnimeList] = useState<Array<animeInterface>>(initial_anime);
  //アニメカードの表示に必要な変数の定義
  //とりあえず初期値はテキトーなので直す余地あり
  const [animeList,setAnimeList] = useState<Array<animeInterface>>(initial_anime);
  const [val,setVal] = useState<Array<string>>([]);
  const [likeId,setLikeId] = useState<Array<string>>([]);
  const [SEARCH_ANIME,setSEARCH_ANIME] = useState<DocumentNode>(gql`
  query {
    searchWorks(
      orderBy: { field: WATCHERS_COUNT, direction: DESC },
      first: 10,
      titles: []
    ) {
        nodes {
          annictId
          malAnimeId
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
        first: 20,
        titles: ["${value}"]
      ) {
          nodes {
            annictId
            malAnimeId
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
    if (likeId.includes(e.target.id)) {
      setLikeId(likeId.filter(item => item !== e.target.id));
    }else {
      setLikeId([...likeId,e.target.id]);
    }
  }

  //選択しているアニメカードを管理している(削除ボタンで削除可能)
  const valChangeBtn = (e:React.MouseEvent<HTMLButtonElement>) => {
    if (val.includes(e.currentTarget.value)) {
      setVal(val.filter(item => item !== e.currentTarget.value));
    }else {
      setVal([...val,e.currentTarget.value]);
    }
    if (likeId.includes(e.currentTarget.id)) {
      setLikeId(likeId.filter(item => item !== e.currentTarget.id));
    }else {
      setLikeId([...likeId,e.currentTarget.id]);
    }
  }

  //選択されたアニメ一覧を表示する
  //確認用なので後で消す
  const valDisplay = () => [
    setPushCount(pushCount+1)
  ]

  //検索した結果出てきたアニメの情報をリストに格納してる
  const makeAnimeList = () => {
    if (data) {
      console.log(data)
      const li = [];
      for (let i = 0; i < data.searchWorks.nodes.length; i++){
        li.push(data.searchWorks.nodes[i]);
      }
      setAnimeList(li);
      const lenAnimeList = li.length;
      setNumPage((lenAnimeList > 10)?Math.ceil(lenAnimeList/10):0)
      setDisplayAnimeList(li.slice(0,10))
      console.log(animeList)
    }
  }

  const changePage = (page:number) =>{
    const end = (page) * 10;
    const start = end - 10;
    setNowPage(page);
    setDisplayAnimeList(animeList.slice(start,end));
  }

  //data(graphQLの実行結果)の値が変わる度にmakeAnimeList関数が実行される
  useEffect(makeAnimeList,[data])


  //なんかページ読み込んだタイミングで何もアニメカードが表示されないから直したい
  return (
    <div className='App'>
      <AppShell 
        navbar={<Navbar width={{base:200}}>
                  <SearchBox onChange={_.debounce((e) => handleChange(e),500)}/>
                  <Sidebar setSearchAnime={setSEARCH_ANIME} setNowPage={setNowPage} inputAnime={inputAnime}/>
                </Navbar>}
        header={<Header height={60}><SiteTitle/></Header>}>
      <div className="main">
        <div className='animebox'>
          <div className='animes'>
            {displayAnimeList.map((info,index) => {
              return (
                info.image?
                (<MalCard annictID={info.annictId} malAnimeId={info.malAnimeId} recommendImgUrl={info.image.recommendedImageUrl} facebookImgUrl={info.image.facebookOgImageUrl} officialSiteUrl={info.officialSiteUrl} media={info.media} animeTitle={info.title} twitterUsername={info.twitterUsername} value={info.title} onChange={valChange} checked={val.includes(info.title)} key={index}/>)
                :(<MalCard annictID={info.annictId} malAnimeId={info.malAnimeId} recommendImgUrl='' facebookImgUrl='' officialSiteUrl={info.officialSiteUrl}  media={info.media} animeTitle={info.title} twitterUsername={info.twitterUsername} value={info.title} onChange={valChange} checked={val.includes(info.title)} key={index}/>)
                )
            })}
          </div>
          <Pagination total={numPage} position="center" onChange={(page:number) => changePage(page)} page={nowPage}/>
        </div>
        <div>
          現在選択中のアニメ
        </div>
        <div className='selectAnimeBox'>
          <ul>
            {val.map((title,index) =>
            <li value={title} id={likeId[index]}>
              {title}
              <button className="deleteBtn" onClick={valChangeBtn} value={title} id={likeId[index]}>
                <MdDeleteForever className='deleteIcon'/>
              </button>
            </li>
            )}
          </ul>
        </div>
        <SearchButton onClick={valDisplay}/>
        <ResultAnime pushCount={pushCount} likeList={likeId}/>
      </div>
      </AppShell>
    </div>
  );
}

export default App;
