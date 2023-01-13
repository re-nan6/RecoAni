import { RiVipCrownFill } from 'react-icons/ri';
import { HiFire } from 'react-icons/hi';
import { GiPalmTree } from 'react-icons/gi';
import { gql } from '@apollo/client';
import { getSeasons } from 'utils/getSeasons';
import { Navbar, NavLink } from '@mantine/core';
import { useContext } from 'react';
import { animeDisplayContext, NavbarContext } from 'App';

//ナビゲーションバーのコンポーネント
//「今期のアニメ」等を自動で検索できるようにしたい

//@param setSearchAnime - 実行するGQLを変更するuseState
//@param setNowPage - 現在のページ番号を変更するuseState
//@param inputAnime - annictAPIを呼び出すためのもの
//@return サイドバーが表示される

export const LayoutNavbar = () => {
  const animeDisplay = useContext(animeDisplayContext);
  const navbarDisplay = useContext(NavbarContext);
  // const navbarDisplay = useContext(NavbarContext);
  //時期を指定してアニメを検索する関数
  const seasonAnimeDisplay = (season: string) => {
    animeDisplay.setSearchAnime(gql`
    query {
      searchWorks(
        seasons:["${season}"],
        orderBy: { field: WATCHERS_COUNT, direction: DESC }
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
    animeDisplay.inputAnime();
    animeDisplay.setNowPage(1);
  };
  //人気のアニメ(anncitの視聴数順)を検索する関数
  const popularAnimeDisplay = () => {
    animeDisplay.setSearchAnime(gql`
      query {
        searchWorks(orderBy: { field: WATCHERS_COUNT, direction: DESC }, first: 50) {
          nodes {
            annictId
            malAnimeId
            officialSiteUrl
            title
            twitterUsername
            media
            image {
              facebookOgImageUrl
              recommendedImageUrl
            }
          }
        }
      }
    `);
    animeDisplay.inputAnime();
    animeDisplay.setNowPage(1);
  };

  // シーズン（ex. 2022-autumn）を取得する
  const seasons = getSeasons();
  return (
    <Navbar width={{ sm: 130, lg: 150 }} hiddenBreakpoint='sm' hidden={!navbarDisplay.opened}>
      <Navbar.Section
        onClick={() => {
          seasonAnimeDisplay(`${seasons.currentSeason.year}-${seasons.currentSeason.season}`);
          navbarDisplay.setOpened((o) => !o);
        }}
      >
        <NavLink key='今期アニメ' label='今期アニメ' icon={<HiFire size={20} />}></NavLink>
      </Navbar.Section>
      <Navbar.Section
        onClick={() => {
          seasonAnimeDisplay(`${seasons.previousSeason.year}-${seasons.previousSeason.season}`);
          navbarDisplay.setOpened((o) => !o);
        }}
      >
        <NavLink key='前期アニメ' label='前期アニメ' icon={<GiPalmTree size={20} />}></NavLink>
      </Navbar.Section>
      <Navbar.Section
        onClick={() => {
          popularAnimeDisplay();
          navbarDisplay.setOpened((o) => !o);
        }}
      >
        <NavLink key='人気アニメ' label='人気アニメ' icon={<RiVipCrownFill size={20} />}></NavLink>
      </Navbar.Section>
    </Navbar>
  );
};
