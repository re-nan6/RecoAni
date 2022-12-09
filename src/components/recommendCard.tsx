import React, { useEffect, useState } from 'react';
import styles from './recommendCard.module.css';
import { Card, Image, Text, Group, NavLink, Tooltip, CardSection, Button, ThemeIcon, UnstyledButton, Avatar, Stack, Badge} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import Youtube from 'react-youtube';
import { FiMonitor } from 'react-icons/fi';
import { FaTwitter, FaWikipediaW } from 'react-icons/fa';
import { CgWebsite } from 'react-icons/cg';
//サイトタイトルのコンポーネント
//フォント・サイズの設定したい
//ロゴとかもほしいかも

//@return サイトのタイトルが表示される

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

interface Url{
  url:string;
}
const RecommendCard: React.FC<Props> = ({annictId,title,malAnimeId,officialSiteUrl,twitterUsername,wikipediaUrl,recommendImgUrl,facebookImgUrl,seasonName,seasonYear}) => {
  const [animePvList,setAnimePvList] = useState<Array<Url>>([{url: 'https://youtu.be/IRxdEcemmsE'}]);
  const [malImage,setMalImage] = useState<string>(`${process.env.PUBLIC_URL}/noimage.png`)
  useEffect(() => {
    const access_api = async(param:string) => {
      const response = await fetch(`https://dev-recoani-d6gutf2s.onrender.com/api/mal/pv?malAnimeId=${param}`,{
        method:'GET',})
        if (!response.ok){
          const err = await response.json()
          throw new Error(err)
        }
      const data = await response.json();
      const PvList = data.data;
      setAnimePvList(PvList);
      const response2 = await fetch(`https://dev-recoani-d6gutf2s.onrender.com/api/mal/image?malAnimeId=${malAnimeId}`,{
        method:'GET',})
        if (!response2.ok){
          const err = await response2.json()
          throw new Error(err)
        }
      const data2 = await response2.json();
      const url = data2.data[0]['url']
      setMalImage(url)
      console.log(PvList)
    }
    access_api(malAnimeId)
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
              <Carousel sx={{width:712}} mx="auto" withIndicators loop height={400}>
                {recommendImgUrl && <Carousel.Slide><Image src={recommendImgUrl} withPlaceholder placeholder={<Image src={malImage} withPlaceholder/>}/></Carousel.Slide>}
                {(!recommendImgUrl && facebookImgUrl) && <Carousel.Slide><Image src={facebookImgUrl} withPlaceholder placeholder={<Image src={malImage} withPlaceholder/>}/></Carousel.Slide>}
              {animePvList.map((info) => {
              return (
                <Carousel.Slide>
                  <div className={styles.youtube}>
                  <iframe src={"https://www.youtube-nocookie.com/embed/"+info.url.slice(-11)}
                          sandbox="allow-forms allow-scripts allow-pointer-lock allow-same-origin allow-top-navigation allow-presentation"
                          allowFullScreen
                          />
                  </div>
                </Carousel.Slide>
            )})}
              </Carousel>
                <div className={styles.sideBar}>
                  <Stack align="center" justify="flex-start">
                    <Tooltip
                      label="公式サイト"
                      position='right'
                      withArrow>
                      <Avatar
                      component='a'
                      href={officialSiteUrl}
                      target="_blank"
                      size="lg"
                      className={styles.sideButton}>
                        <FiMonitor/>
                      </Avatar>
                    </Tooltip>
                    <Tooltip
                      label="Twitter"
                      position='right'
                      withArrow>
                      <Avatar
                      component='a'
                      href={twitterUsername}
                      target="_blank"
                      size="lg"
                      className={styles.sideButton}>
                        <FaTwitter/>
                      </Avatar>
                    </Tooltip>
                    <Tooltip
                      label="Annict"
                      position='right'
                      withArrow>
                      <Avatar
                        component='a'
                        href={"https://annict.com/works/" + annictId}
                        target="_blank"
                        size="lg"
                        className={styles.sideButton}>
                          <CgWebsite/>
                      </Avatar>
                    </Tooltip>
                    <Tooltip
                      label="Wikipedia"
                      position='right'
                      withArrow>
                      <Avatar
                        component='a'
                        href={wikipediaUrl}
                        target="_blank"
                        size="lg"
                        className={styles.sideButton}>
                          <FaWikipediaW/>
                      </Avatar>
                    </Tooltip>
                  </Stack>
                </div>
            </Group>
        </Card>
    </div>
  );
};

export default RecommendCard