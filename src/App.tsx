import React, { useState, useEffect } from 'react';
import './App.css';
import { MalCard } from 'components/malCard';
import { ResultAnime } from 'components/resultAnime';
import { SearchButton } from 'components/searchButton';
import { Sidebar } from 'components/sidebar';
import { SiteTitle } from 'components/siteTitle';
import { CustomFont } from 'layouts/customFont';
import { MdDeleteForever } from 'react-icons/md';
import { FiAlertCircle } from 'react-icons/fi';
import _ from 'lodash';
import { gql, useLazyQuery, DocumentNode } from '@apollo/client';
import {
  AppShell,
  Alert,
  Header,
  Burger,
  Navbar,
  Pagination,
  MantineProvider,
  SimpleGrid,
  Container,
  Center,
  MediaQuery,
  Group,
  Image,
  Table,
  ActionIcon,
  ScrollArea,
  Tooltip,
} from '@mantine/core';
import { QueryClient, QueryClientProvider } from 'react-query';
import SearchBox from './components/searchBox';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});
function App() {
  //annictAPIから受け取れるjsonファイルの中身の型定義
  interface animeInterface {
    __typename: string;
    annictId: number;
    malAnimeId: string;
    officialSiteUrl: string;
    title: string;
    twitterUsername: string;
    wikipediaUrl: string;
  }

  //レコメンド結果表示に必要なフラグの定義
  const [pushCount, setPushCount] = useState<number>(0);
  //表示するアニメカードのページ数を管理している
  const [numPage, setNumPage] = useState<number>(0);
  //現在表示しているページ番号を管理している
  const [nowPage, setNowPage] = useState<number>(1);
  //表示させるアニメを管理している
  const [displayAnimeList, setDisplayAnimeList] = useState<Array<animeInterface>>([]);
  //アニメカードの表示に必要な変数の定義
  //とりあえず初期値はテキトーなので直す余地あり
  const [animeList, setAnimeList] = useState<Array<animeInterface>>([]);
  const [val, setVal] = useState<Array<string>>([]);
  const [likeId, setLikeId] = useState<Array<string>>([]);
  const [SEARCH_ANIME, setSEARCH_ANIME] = useState<DocumentNode>(gql`
    query {
      searchWorks(orderBy: { field: WATCHERS_COUNT, direction: DESC }, first: 12, titles: []) {
        nodes {
          annictId
          malAnimeId
          officialSiteUrl
          title
          twitterUsername
          wikipediaUrl
        }
      }
    }
  `);

  //graphQLでannictAPIを適宜呼び出すためのもの
  const [inputAnime, { data }] = useLazyQuery(SEARCH_ANIME);

  //テキストボックスに入力された文字列を元にqueryを作成
  const search = (value: string) => {
    setSEARCH_ANIME(gql`
    query {
      searchWorks(
        orderBy: { field: WATCHERS_COUNT, direction: DESC },
        first: 24,
        titles: ["${value}"]
      ) {
          nodes {
            annictId
            malAnimeId
            officialSiteUrl
            title
            twitterUsername
            wikipediaUrl
        }
      }
    }
    `);
  };

  //テキストボックスの中身が変わるたびにこの関数が実行される
  //queryの定義とannictAPIの使用
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    search(e.target.value);
    inputAnime();
  };

  //選択しているアニメカードを管理している(アニメカードをクリックした際に実行)
  const valChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (val.includes(e.target.value)) {
      setVal(val.filter((item) => item !== e.target.value));
    } else {
      setVal([...val, e.target.value]);
    }
    if (likeId.includes(e.target.id)) {
      setLikeId(likeId.filter((item) => item !== e.target.id));
    } else {
      setLikeId([...likeId, e.target.id]);
    }
  };

  //選択しているアニメカードを管理している(選択されたアニメ一覧にあるボタンを押した際に実行)
  const valChangeBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (val.includes(e.currentTarget.value)) {
      setVal(val.filter((item) => item !== e.currentTarget.value));
    } else {
      setVal([...val, e.currentTarget.value]);
    }
    if (likeId.includes(e.currentTarget.id)) {
      setLikeId(likeId.filter((item) => item !== e.currentTarget.id));
    } else {
      setLikeId([...likeId, e.currentTarget.id]);
    }
  };

  //選択されたアニメ一覧を表示する
  //確認用なので後で消す
  const valDisplay = () => [setPushCount(pushCount + 1)];

  //検索した結果出てきたアニメの情報をリストに格納してる
  const makeAnimeList = () => {
    if (data) {
      const li = [];
      for (let i = 0; i < data.searchWorks.nodes.length; i++) {
        li.push(data.searchWorks.nodes[i]);
      }
      setAnimeList(li);
      const lenAnimeList = li.length;
      setNumPage(lenAnimeList > 12 ? Math.ceil(lenAnimeList / 12) : 0);
      setDisplayAnimeList(li.slice(0, 12));
    } else {
      inputAnime();
    }
  };

  //ページ遷移をした際の処理
  const changePage = (page: number) => {
    const end = page * 12;
    const start = end - 12;
    setNowPage(page);
    setDisplayAnimeList(animeList.slice(start, end));
  };

  //data(graphQLの実行結果)の値が変わる度にmakeAnimeList関数が実行される
  useEffect(makeAnimeList, [data, inputAnime]);

  // ナビゲーションバーのburgerの表示・非表示
  const [opened, setOpened] = useState(false);

  // 選択中のアニメを表示するテーブルのアイテム
  const tableRows = val.map((title, index) => (
    <tr key={title}>
      <td>{title}</td>
      <td>
        <Group position='right' spacing='md'>
          <Tooltip label='削除'>
            <ActionIcon onClick={valChangeBtn} value={title} id={likeId[index]} color='red'>
              <MdDeleteForever size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </td>
    </tr>
  ));

  return (
    <MantineProvider
      theme={{
        fontFamily: 'Noto Sans Japanese',
      }}
    >
      <CustomFont />
      <QueryClientProvider client={queryClient}>
        <AppShell
          navbar={
            <Navbar width={{ sm: 100, md: 170, lg: 200 }} hiddenBreakpoint='sm' hidden={!opened}>
              <Sidebar
                setSearchAnime={setSEARCH_ANIME}
                setNowPage={setNowPage}
                inputAnime={inputAnime}
              />
            </Navbar>
          }
          header={
            <Header height={{ base: 60, md: 70 }}>
              <Group position='left'>
                <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
                  <Burger
                    opened={opened}
                    onClick={(o) => setOpened((o) => !o)}
                    size='md'
                    color='black'
                    mr='xl'
                  ></Burger>
                </MediaQuery>
                <SiteTitle />
              </Group>
              <Group position='right'></Group>
            </Header>
          }
        >
          <Container size='xl'>
            <Center>
              <SearchBox onChange={_.debounce((e) => handleChange(e), 500)}></SearchBox>
            </Center>
            <SimpleGrid
              cols={4}
              spacing='md'
              breakpoints={[
                { maxWidth: 'lg', cols: 2, spacing: 'md' },
                { maxWidth: 'md', cols: 1, spacing: 'sm' },
                { maxWidth: 'sm', cols: 1, spacing: 'sm' },
              ]}
            >
              {displayAnimeList.map((info) => {
                return (
                  <MalCard
                    annictID={info.annictId}
                    malAnimeId={info.malAnimeId}
                    officialSiteUrl={info.officialSiteUrl}
                    animeTitle={info.title}
                    twitterUsername={info.twitterUsername}
                    wikipediaUrl={info.wikipediaUrl}
                    value={info.title}
                    onChange={valChange}
                    checked={val.includes(info.title)}
                    key={info.annictId}
                  />
                );
              })}
            </SimpleGrid>
            <Center p='md'>
              <Pagination
                total={numPage}
                position='center'
                onChange={(page: number) => changePage(page)}
                page={nowPage}
              />
            </Center>
            <div className='text'>現在選択中のアニメ</div>
            <div>
              <ScrollArea style={{ height: 200 }}>
                <Table highlightOnHover verticalSpacing='sm' fontSize='lg'>
                  <tbody>{tableRows}</tbody>
                </Table>
              </ScrollArea>
            </div>
            <Center p='sm'>
              <SearchButton onClick={valDisplay} />
            </Center>

            <ResultAnime pushCount={pushCount} likeList={likeId} />

            <div>
              <Alert icon={<FiAlertCircle size={16} />} title='注意' color='red' p='md' py={10}>
                <p>
                  このサイトはAnnictAPIのレビュー評価をもとに学習を行い、レコメンド結果を表示しています。結果は期待にそぐわない可能性があります。
                </p>
              </Alert>
            </div>
          </Container>
        </AppShell>
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default App;
