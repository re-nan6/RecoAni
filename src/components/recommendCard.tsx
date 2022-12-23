import React, { useEffect, useState } from 'react';
import styles from './recommendCard.module.css';
import LinkButton from './linkButton';
import { FiMonitor } from 'react-icons/fi';
import { FaTwitter, FaWikipediaW } from 'react-icons/fa';
import { RiCharacterRecognitionFill } from 'react-icons/ri';
import { Carousel } from '@mantine/carousel';
import { Badge, Card, Group, Image, Stack, Text } from '@mantine/core';

//レコメンド結果を表示するカードのコンポーネント
//例外処理まだ設定できてない(画像関連・画像とPV両方がない場合)

//@param annictID - アニメを一意に紐づけするID
//@param title - そのアニメのタイトル
//@param malAnimeId - myanimelistのID
//@param officialSiteUrl - 公式サイトのURL
//@param twitterUsername - twitterのURL
//@param wikipediaUrl - wikiのURL
//@param recommendImgUrl - アニメ画像のURL その１
//@param facebookImgUrl - アニメ画像のURL その２
//@param seasonName - 放送時期
//@param seasonYear - 放送年度
//@return 画像URLが存在する場合 - 画像とPVの両方あるカードを表示
//@return 画像URLが存在しない場合 - PVのみのカードを表示

type Props = {
    annictId:number;
    title:string;
    malAnimeId:string;
    officialSiteUrl:string;
    twitterUsername:string;
    wikipediaUrl:string;
    recommendImgUrl:string|undefined;
    facebookImgUrl:string|undefined;
    seasonName:string;
    seasonYear:number;
}

//自作APIから受け取れるjsonファイルの型定義
interface Url{
  url:string;
}

const RecommendCard: React.FC<Props> = ({annictId,title,malAnimeId,officialSiteUrl,twitterUsername,wikipediaUrl,recommendImgUrl,facebookImgUrl,seasonName,seasonYear}) => {
  const [animePvList,setAnimePvList] = useState<Array<Url|null>>([]);
  const [malImage,setMalImage] = useState<string>(`${process.env.PUBLIC_URL}/noimage.png`);

  //PVと画像のURLを取得するAPIを実行
  useEffect(() => {
    const access_api = async(param:string) => {
      const response = await fetch(`https://dev-recoani-d6gutf2s.onrender.com/api/mal/pv?malAnimeId=${param}`,{
        method:'GET',})
        if (!response.ok){
          const err = await response.json();
          throw new Error(err);
        }
      const data = await response.json();
      const PvList = data.data;
      setAnimePvList(PvList);
      const response2 = await fetch(`https://dev-recoani-d6gutf2s.onrender.com/api/mal/image?malAnimeId=${malAnimeId}`,{
        method:'GET',})
        if (!response2.ok){
          const err = await response2.json();
          throw new Error(err);
        }
      const data2 = await response2.json();
      const url = data2.data[0]['url'];
      setMalImage(url);
    }
    access_api(malAnimeId);
    },[malAnimeId])
  return (
    <div className={styles.card}>
      <Card withBorder radius="md" p={0} shadow="sm">
        <Card.Section withBorder>
          <Badge className={styles.season}>{seasonYear}-{seasonName}</Badge>
          <div className={styles.title}>
            <Text weight={500} size="xl">{title}</Text>
          </div>
        </Card.Section>
        <Group noWrap spacing={0}>
          <Carousel sx={{width:712}} mx="auto" withIndicators loop height={400} initialSlide={1}>
            {recommendImgUrl && <Carousel.Slide><Image src={recommendImgUrl} height={360} withPlaceholder placeholder={<div className={styles.portrait}><Image src={malImage} withPlaceholder fit='contain'/></div>}/></Carousel.Slide>}
            {(!recommendImgUrl && facebookImgUrl) && <Carousel.Slide><Image src={facebookImgUrl} height={360} withPlaceholder placeholder={<div className={styles.portrait}><Image src={malImage} withPlaceholder fit='contain'/></div>}/></Carousel.Slide>}
          {animePvList.map((info) => {
          return (
            info && (
            <Carousel.Slide>
              <div className={styles.youtube}>
              <iframe src={"https://www.youtube-nocookie.com/embed/"+info.url.slice(-11)}
                      sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation allow-presentation"
                      allowFullScreen
                      />
              </div>
            </Carousel.Slide>
          ))})}
          {(!recommendImgUrl && !facebookImgUrl && animePvList.length === 0) && <Carousel.Slide><Image height={360} withPlaceholder/></Carousel.Slide>}
          </Carousel>
          <div>
            <Stack align="center" justify="flex-start">
              <LinkButton label='公式サイト' href={officialSiteUrl}>
               <FiMonitor/>
              </LinkButton>
              <LinkButton label='Twitter' href={`https://twitter.com/${twitterUsername}`}>
               <FaTwitter/>
              </LinkButton>
              <LinkButton label='Annict' href={"https://annict.com/works/" + annictId}>
               <RiCharacterRecognitionFill/>
              </LinkButton>
              <LinkButton label='Wikipedia' href={wikipediaUrl}>
                <FaWikipediaW/>
              </LinkButton>
            </Stack>
          </div>
        </Group>
      </Card>
    </div>
  );
};

export default RecommendCard