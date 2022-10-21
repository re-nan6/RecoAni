import React from 'react';
import logo from './logo.svg';
import {useState} from 'react';
import './App.css';
import Title from './components/title';
import SearchBox from './components/searchBox';
import SearchButton from './components/searchButton';
import AnimeCard from './components/animeCard';
import { ApolloProvider, gql, useLazyQuery, DocumentNode} from '@apollo/client';

function App() {

  //アニメカードの表示に必要な変数の定義
  const [titleList,setTitleList] = useState<Array<string>>([]);
  const [imageList,setImageList] = useState<Array<string>>([]);
  const [mediaList,setMediaList] = useState<Array<string>>([]);
  const [SEARCH_ANIME,setSEARCH_ANIME] = useState<DocumentNode>(gql`
  query {
    searchWorks(
      orderBy: { field: WATCHERS_COUNT, direction: DESC },
      first: 3,
      titles:["あ"]
    ) {
      edges {
        node {
          annictId
          title
          watchersCount
        }
      }
    }
  }
  `);

  //graphQLを適宜呼び出すためのもの
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
            title
            media
            image{recommendedImageUrl}
        }
      }
    }
    `)
  }

  //テキストボックスの中身が変わるたびにこの関数が実行される
  //queryの定義とGQLの呼び出しと
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
    inputAnime();
    console.log(data);
  }
  return (
    <div className='App'>
      <div className="main">
        <Title/>
        <SearchBox onChange={(e) => handleChange(e)}/>
        <div className='animebox'>
          <div className='animes'>
            <AnimeCard annictID="01" animeUrl="https://kaguya.love/og_220318.png" media="映画" animeTitle='かぐや様は告らせたい-ファーストキッスは終わらない-'/>
            <AnimeCard annictID="02" animeUrl="https://lycoris-recoil.com/ogp3.png" media="TV" animeTitle='リコリス・リコイル'/>
            <AnimeCard annictID="03" animeUrl="https://engage-kiss.com/ogp.png?0617" media="TV" animeTitle='Engage Kiss'/>
          </div>
        </div>
        <SearchButton/>
      </div>
    </div>
  );
}

export default App;
