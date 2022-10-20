import React from 'react';
import logo from './logo.svg';
import {useState} from 'react';
import './App.css';
import Title from './components/title';
import SearchBox from './components/searchBox';
import SearchButton from './components/searchButton';
import AnimeCard from './components/animeCard';

function App() {
  const [anime,setAnime] = useState<string>("");
  return (
    <div className='App'>
      <div className="main">
        <Title/>
        <SearchBox setAnime={setAnime}/>
        {anime}
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
