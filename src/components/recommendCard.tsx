import React, { useEffect, useState } from 'react';
import styles from './recommendCard.module.css';
import { LinkButton } from './linkButton';
import { FiMonitor } from 'react-icons/fi';
import { FaTwitter, FaWikipediaW } from 'react-icons/fa';
import { RiCharacterRecognitionFill } from 'react-icons/ri';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Badge, Card, Group, Image, Stack, Text, AspectRatio, Button, Center } from '@mantine/core';

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
  annictId: number;
  title: string;
  malAnimeId: string;
  officialSiteUrl: string;
  twitterUsername: string;
  wikipediaUrl: string;
  recommendImgUrl: string | undefined;
  facebookImgUrl: string | undefined;
  seasonName: string;
  seasonYear: number;
};

//自作APIから受け取れるjsonファイルの型定義
interface Url {
  url: string;
}

export const RecommendCard: React.FC<Props> = ({
  annictId,
  title,
  malAnimeId,
  officialSiteUrl,
  twitterUsername,
  wikipediaUrl,
  recommendImgUrl,
  facebookImgUrl,
  seasonName,
  seasonYear,
}) => {
  const [animePvList, setAnimePvList] = useState<Array<Url | null>>([]);
  const [malImage, setMalImage] = useState<string>(`${process.env.PUBLIC_URL}/noimage.png`);

  //PVと画像のURLを取得するAPIを実行
  useEffect(() => {
    const access_api = async (param: string) => {
      const response = await fetch(
        `${process.env.REACT_APP_RECOANI_API_URL}/mal/pv?malAnimeId=${param}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err);
      }
      const data = await response.json();
      const PvList = data.data;
      setAnimePvList(PvList);
      const response2 = await fetch(
        `${process.env.REACT_APP_RECOANI_API_URL}/mal/image?malAnimeId=${malAnimeId}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );
      if (!response2.ok) {
        const err = await response2.json();
        throw new Error(err);
      }
      const data2 = await response2.json();
      const url = data2.data[0]['url'];
      setMalImage(url);
    };
    access_api(malAnimeId);
  }, [malAnimeId]);
  const responsiveMatches = useMediaQuery('(min-width: 900px)');
  return (
    <Card withBorder radius='md' shadow='sm' key={malAnimeId}>
      <Card.Section withBorder>
        <Badge radius='xs' py={2} mx={4}>
          {seasonYear}-{seasonName}
        </Badge>
        <Text weight={500} size='xl' ta='left' m='xs'>
          {title}
        </Text>
      </Card.Section>

      <Carousel mx='auto' withIndicators loop slideSize='100%'>
        {recommendImgUrl && (
          <Carousel.Slide key={recommendImgUrl}>
            <AspectRatio ratio={16 / 9}>
              <Image
                src={recommendImgUrl}
                withPlaceholder
                placeholder={
                  <div>
                    <Image src={malImage} withPlaceholder fit='contain' />
                  </div>
                }
                fit='scale-down'
              />
            </AspectRatio>
          </Carousel.Slide>
        )}
        {!recommendImgUrl && facebookImgUrl && (
          <Carousel.Slide key={facebookImgUrl}>
            <AspectRatio ratio={16 / 9}>
              <Image
                src={facebookImgUrl}
                withPlaceholder
                placeholder={
                  <div>
                    <Image src={malImage} withPlaceholder fit='contain' />
                  </div>
                }
                fit='scale-down'
              />
            </AspectRatio>
          </Carousel.Slide>
        )}
        {!recommendImgUrl && !facebookImgUrl && (
          <Carousel.Slide key={malImage}>
            <AspectRatio ratio={16 / 9}>
              <Image src={malImage} withPlaceholder fit='scale-down' />
            </AspectRatio>
          </Carousel.Slide>
        )}
        {animePvList.map((info) => {
          return (
            info && (
              <Carousel.Slide key={info.url.slice(-11)}>
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={'https://www.youtube-nocookie.com/embed/' + info.url.slice(-11)}
                    sandbox='allow-scripts allow-same-origin allow-popups allow-presentation allow-forms allow-top-navigation'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                    key={info.url}
                    title={info.url}
                  />
                </AspectRatio>
              </Carousel.Slide>
            )
          );
        })}
        {!recommendImgUrl && !facebookImgUrl && animePvList.length === 0 && (
          <Carousel.Slide key='noimage'>
            <AspectRatio ratio={16 / 9}>
              <Image withPlaceholder fit='scale-down' />
            </AspectRatio>
          </Carousel.Slide>
        )}
      </Carousel>
      <Card.Section>
        <Group position='center'>
          <LinkButton label='公式サイト' href={officialSiteUrl} matches={responsiveMatches}>
            <FiMonitor />
            <Text hidden={!responsiveMatches} px={3}>
              公式サイト
            </Text>
          </LinkButton>
          <LinkButton
            label='Twitter'
            href={`https://twitter.com/${twitterUsername}`}
            matches={responsiveMatches}
          >
            <FaTwitter />
            <Text hidden={!responsiveMatches} px={3}>
              Twitter
            </Text>
          </LinkButton>
          <LinkButton
            label='Annict'
            href={'https://annict.com/works/' + annictId}
            matches={responsiveMatches}
          >
            <RiCharacterRecognitionFill />
            <Text hidden={!responsiveMatches} px={3}>
              Annict
            </Text>
          </LinkButton>
          <LinkButton label='Wikipedia' href={wikipediaUrl} matches={responsiveMatches}>
            <FaWikipediaW />
            <Text hidden={!responsiveMatches} px={3}>
              Wikipedia
            </Text>
          </LinkButton>
        </Group>
      </Card.Section>
    </Card>
  );
};
