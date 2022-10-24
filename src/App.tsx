import React from 'react';
import {useState, useEffect} from 'react';
import './App.css';
import Title from './components/title';
import SearchBox from './components/searchBox';
import SearchButton from './components/searchButton';
import AnimeCard from './components/animeCard';
import {gql, useLazyQuery, DocumentNode} from '@apollo/client';

function App() {

  //annictAPIから受け取れるjsonファイルの中身の型定義の一部
  interface imageInterface {
    __typename:string
    recommendedImageUrl:string
  }

  //annictAPIから受け取れるjsonファイルの中身の型定義
  interface animeInterface{
    __typename: string
    annictId:string
    title: string
    media: string
    image: imageInterface | null
  }

  //アニメカードの表示に必要な変数の定義
  //とりあえず初期値はテキトーなので直す余地あり
  const [animeList,setAnimeList] = useState<Array<animeInterface>>([]);
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
          title
          media
          image{recommendedImageUrl}
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
            title
            media
            image{recommendedImageUrl}
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

  const valChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (val.includes(e.target.value)) {
      setVal(val.filter(item => item !== e.target.value));
    }else {
      setVal([...val,e.target.value]);
    }
  }

  const valDisplay = () => [
    console.log(val)
  ]

  //検索した結果出てきたアニメの情報をリストに格納してる
  const makeAnimeList = () => {
    if (data) {
      let li = [];
      for (let i = 0; i < data.searchWorks.nodes.length; i++){
        li.push(data.searchWorks.nodes[i]);
      }
      setAnimeList(li);
    }
  }

  //data(graphQLの実行結果)の値が変わる度にmakeAnimeList関数が実行される
  useEffect(makeAnimeList,[data])


  //なんかページ読み込んだタイミングで何もアニメカードが表示されないから直したい
  return (
    <div className='App'>
      <div className="main">
        <Title/>
        <SearchBox onChange={(e) => handleChange(e)}/>
        <div className='animebox'>
          <div className='animes'>
            {animeList.map((info,index) => {
              return (
                info.image?
                (<AnimeCard annictID={info.title} animeUrl={info.image.recommendedImageUrl} media={info.media} animeTitle={info.title} value={info.title} onChange={valChange} checked={val.includes(info.title)}/>)
                :(<AnimeCard annictID={info.title} animeUrl='' media={info.media} animeTitle={info.title} value={info.title} onChange={valChange} checked={val.includes(info.title)}/>)
                )
            })}
          </div>
        </div>
        <SearchButton onClick={valDisplay}/>
      </div>
    </div>
  );
}

export default App;
