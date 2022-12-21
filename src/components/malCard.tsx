import React, { useEffect, useState } from 'react'
import styles from './malCard.module.css';
import { CgWebsite } from 'react-icons/cg';
import { FiMonitor } from 'react-icons/fi';
import { FaTwitter, FaWikipediaW } from 'react-icons/fa';
import { RiCharacterRecognitionFill } from 'react-icons/ri'
import { Card, Group, Image, NavLink, Text, Tooltip } from '@mantine/core'
import { useQuery } from 'react-query';
import axios from 'axios';

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
  wikipediaUrl:string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}

const MalCard: React.FC<Props> = ({ annictID, malAnimeId, officialSiteUrl, animeTitle, twitterUsername, wikipediaUrl, value, onChange, checked }) => {
  const [imgUrl, setImgUrl] = useState<string>(`${process.env.PUBLIC_URL}/noimage.png`)
  const ID = String(annictID);
  const twitterLink = `https://twitter.com/${twitterUsername}`;
  const annictLink = "https://annict.com/works/" + annictID;
  //画像取得を行うAPIの実行
  const getMalurl = async () => {
    const data = await axios.get(`https://dev-recoani-d6gutf2s.onrender.com/api/mal/image?malAnimeId=${malAnimeId}`, {
      method: 'GET',
    })
    return data
  }

  const useQueryMalurl = () => {
    return useQuery({
      queryKey: ["getImage", malAnimeId],
      queryFn: getMalurl,
      cacheTime: Infinity,
      staleTime: Infinity,
    })
  }
  const { status, data } = useQueryMalurl()
  console.log(status)

  useEffect(() => {
    if (data) {
      setImgUrl(data.data.data[0]['url'])
    }
  }, [malAnimeId, status])


  return (
    <div className={styles.card}>
      <input type="checkbox" id={ID} value={value} onChange={onChange} checked={checked} />
      <Card withBorder radius="md" p={0} shadow="sm" component='label' htmlFor={ID}>
        <Group noWrap spacing={0}>
          <Image src={imgUrl} height={200} width={130} />
          <div>
            <Tooltip label={animeTitle} multiline width={170}>
              <Text mt="xs" mb="md" className={styles.title}>
                {animeTitle}
              </Text>
            </Tooltip>
            <NavLink component="a" href={officialSiteUrl} rel="noreferrer" target="_blank" label="公式サイト" icon={<FiMonitor size={15} />} />
            <NavLink component="a" href={twitterLink} rel="noreferrer" target="_blank" label="Twitter" icon={<FaTwitter size={15} color="1D9BF0"/>} />
            <NavLink component="a" href={annictLink} rel="noreferrer" target="_blank" label="Annict" icon={<RiCharacterRecognitionFill size={15} color="F85B73"/>} />
            <NavLink component="a" href={wikipediaUrl} rel="noreferrer" target="_blank" label="Wikipedia" icon={<FaWikipediaW size={15} />} />
            <div className={`${styles.LikesIcon} ${styles.HeartAnimation}`}></div>
          </div>
        </Group>
      </Card>
    </div>
  );
};

export default MalCard