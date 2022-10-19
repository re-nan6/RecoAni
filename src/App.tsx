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
    <div>
      <Title/>
      <SearchBox setAnime={setAnime}/>
      {anime}
      <AnimeCard/>
      <SearchButton/>
    </div>
  );
}

export default App;
