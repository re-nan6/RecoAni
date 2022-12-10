import React from 'react';
import styles from './sidebar.module.css';
import { FiMonitor } from 'react-icons/fi';
import { MdMonitor } from 'react-icons/md';
import {gql, DocumentNode, LazyQueryHookOptions, OperationVariables, QueryResult} from '@apollo/client';

//サイドバーのコンポーネント
//「今期のアニメ」等を自動で検索できるようにしたい

//@param setSearchAnime - 実行するGQLを変更するuseState
//@param setNowPage - 現在のページ番号を変更するuseState
//@param inputAnime - annictAPIを呼び出すためのもの
//@return サイドバーが表示される

type Props = {
  setSearchAnime:React.Dispatch<React.SetStateAction<DocumentNode>>;
  setNowPage:React.Dispatch<React.SetStateAction<number>>;
  inputAnime:(options?: Partial<LazyQueryHookOptions<any, OperationVariables>> | undefined) => Promise<QueryResult<any, OperationVariables>>
}

const Sidebar: React.FC<Props> = ({setSearchAnime,setNowPage,inputAnime}) => {

  //時期を指定してアニメを検索する関数
  const seasonAnimeDisplay = (season:string) => {
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
  //人気のアニメ(anncitの視聴数順)を検索する関数
  const popularAnimeDisplay = () => {
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
      <ul>
        <li className={styles.row} onClick={() => seasonAnimeDisplay("2022-autumn")}>
          <div className={styles.icon}><FiMonitor/></div>
          <div className={styles.title}>今期のアニメ</div>
        </li>
        <li className={styles.row} onClick={() => seasonAnimeDisplay("2022-summer")}>
          <div className={styles.icon}><MdMonitor/></div>
          <div className={styles.title}>前期のアニメ</div>
        </li>
        <li className={styles.row} onClick={popularAnimeDisplay}>
          <div className={styles.icon}><MdMonitor/></div>
          <div className={styles.title}>人気のアニメ</div>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar