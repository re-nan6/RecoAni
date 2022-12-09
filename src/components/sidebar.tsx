import React from 'react';
import styles from './sidebar.module.css';
import { FiMonitor } from 'react-icons/fi';
import { MdMonitor } from 'react-icons/md';
import { NavLink } from '@mantine/core';
import {gql, useLazyQuery, DocumentNode, LazyQueryHookOptions, OperationVariables, QueryResult} from '@apollo/client';
//検索ボックスのコンポーネント
//デザインの変更をしたい

//@param onChange - 検索ボックスの内容が変更された場合に実行される関数
//@return テキストボックスが表示される

type Props = {
  setSearchAnime:React.Dispatch<React.SetStateAction<DocumentNode>>;
  setNowPage:React.Dispatch<React.SetStateAction<number>>;
  inputAnime:(options?: Partial<LazyQueryHookOptions<any, OperationVariables>> | undefined) => Promise<QueryResult<any, OperationVariables>>
}



const Sidebar: React.FC<Props> = ({setSearchAnime,setNowPage,inputAnime}) => {
  const valDisplay = (season:string) => {
    setSearchAnime(gql`
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
    `)
    inputAnime();
    setNowPage(1);
  }
  const popularDisplay = () => {
    setSearchAnime(gql`
    query {
      searchWorks(
        orderBy: { field: WATCHERS_COUNT, direction: DESC },
        first: 50,
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
    inputAnime();
    setNowPage(1);
  }
  return (
      <div className={styles.box}>
        {/* <NavLink component="button" label="公式サイト" icon={<FiMonitor size={15}/>}/> */}
        <ul>
            <li className={styles.row} onClick={() => valDisplay("2022-autumn")}>
                <div className={styles.icon}><FiMonitor/></div>
                <div className={styles.title}>今期のアニメ</div>
            </li>
            <li className={styles.row} onClick={() => valDisplay("2022-summer")}>
                <div className={styles.icon}><MdMonitor/></div>
                <div className={styles.title}>前期のアニメ</div>
            </li>
            <li className={styles.row} onClick={popularDisplay}>
                <div className={styles.icon}><MdMonitor/></div>
                <div className={styles.title}>人気のアニメ</div>
            </li>
        </ul>
      </div>
  );
};

export default Sidebar