import React, { useEffect, useState } from 'react'
import styles from './malCard.module.css';
import { CgWebsite } from 'react-icons/cg';
import { FaTwitter } from 'react-icons/fa';
import { Card, Group, Image, NavLink, Text, Tooltip } from '@mantine/core'
import { useQuery, QueryClient, QueryClientProvider } from 'react-query';

//アニメカードのコンポーネント
//画像リンクが存在しない場合・リンクが無効の場合の例外処理実装したい←実装済み
//ホバーしたときタイトル名をフルで表示する？←実装済み

//@param annictID - アニメを一意に紐づけするID
//@param malAnimeId - myanimelistのID
//@param officialSiteUrl - 公式サイトのURL
//@param animeTitle - そのアニメのタイトル
//@param twitterUsername - twitterのURL
//@param value - そのラベルが持つ値
//@param onChange - そのアニメカードが選択されたときに行う処理
//@param checked - 選択されているかいないかのフラッグ
//@return 画像URLが存在する場合 - そのままアニメカードが表示される
//@return 画像URLが存在しない場合 - NoImageと書かれた画像が表示される

type Props = {
  annictID: number;
  malAnimeId: string;
  officialSiteUrl: string;
  animeTitle: string;
  twitterUsername: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}
const MalCard: React.FC<Props> = ({ annictID, malAnimeId, officialSiteUrl, animeTitle, twitterUsername, value, onChange, checked }) => {
  const [imgUrl, setImgUrl] = useState<string>(`${process.env.PUBLIC_URL}/noimage.png`)
  const ID = String(annictID);
  const twitterLink = `https://twitter.com/${twitterUsername}`;

  //画像取得を行うAPIの実行

  const { data, refetch } = useQuery(
    [`${malAnimeId}`],
    async () => {
      const response = await fetch(`https://dev-recoani-d6gutf2s.onrender.com/api/mal/image?malAnimeId=${malAnimeId}`, {
        method: 'GET',
      })
      const data = await response.json();
      const url = data.data[0]['url']
      setImgUrl(url)
    },
    { staleTime: Infinity, cacheTime: Infinity },
  );
  // refetch();
  useEffect(() => { refetch() }, [malAnimeId])
  // useEffect(() => {
  //   const access_api = async() => {
  //     const response = await fetch(`https://dev-recoani-d6gutf2s.onrender.com/api/mal/image?malAnimeId=${malAnimeId}`,{
  //       method:'GET',})
  //       if (!response.ok){
  //         const err = await response.json()
  //         throw new Error(err)
  //       }
  //       const data = await response.json();
  //       const url = data.data[0]['url']
  //       setImgUrl(url)
  //     }
  //     access_api();
  //   },[malAnimeId])


  return (
    <div className={styles.card}>
      <input type="checkbox" id={ID} value={value} onChange={onChange} checked={checked} />
      <Card withBorder radius="md" p={0} shadow="sm" component='label' htmlFor={ID}>
        <Group noWrap spacing={0}>
          <Image src={imgUrl} height={140} width={100} />
          <div>
            <Tooltip label={animeTitle} multiline width={150}>
              <Text mt="xs" mb="md" className={styles.title}>
                {animeTitle}
              </Text>
            </Tooltip>
            <NavLink component="a" href={officialSiteUrl} rel="noreferrer" target="_blank" label="公式サイト" icon={<CgWebsite size={15} />} />
            <NavLink component="a" href={twitterLink} rel="noreferrer" target="_blank" label="Twitter" icon={<FaTwitter size={15} />} />
            <div className={`${styles.LikesIcon} ${styles.HeartAnimation}`}></div>
          </div>
        </Group>
      </Card>
    </div>
  );
};

export default MalCard