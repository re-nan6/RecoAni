import React, { useEffect, useState } from 'react';
import { LinkButton } from 'components/linkButton';
import { FiMonitor } from 'react-icons/fi';
import { FaTwitter, FaWikipediaW } from 'react-icons/fa';
import { RiCharacterRecognitionFill } from 'react-icons/ri';
import { Carousel } from '@mantine/carousel';
import { useMediaQuery } from '@mantine/hooks';
import { Badge, Card, Group, Image, Text, AspectRatio } from '@mantine/core';
import { useQueries } from 'react-query';
import axios from 'axios';

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
  const responsiveMatches = useMediaQuery('(min-width: 900px)');

  const getRecommendCardImages = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_RECOANI_API_URL}/mal/image?malAnimeId=${malAnimeId}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      },
    );
    return response;
  };

  const getRecommendCardMovies = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_RECOANI_API_URL}/mal/pv?malAnimeId=${malAnimeId}`,
      {
        method: 'GET',
        headers: { Accept: 'application/json' },
      },
    );
    return response;
  };

  const useQueryRecommendCardItems = () => {
    return useQueries([
      {
        queryKey: ['getRecommendCardImages', malAnimeId],
        queryFn: getRecommendCardImages,
        cacheTime: Infinity,
        staleTime: Infinity,
      },
      {
        queryKey: ['getRecommendCardMovies', malAnimeId],
        queryFn: getRecommendCardMovies,
        cacheTime: Infinity,
        staleTime: Infinity,
      },
    ]);
  };

  // useQueryのcache処理

  /** Imageを取得する */
  const getRecommendCardItemsResults = useQueryRecommendCardItems();
  const imageData = getRecommendCardItemsResults[0].data;
  const movieData = getRecommendCardItemsResults[1].data;
  const imageStatus = getRecommendCardItemsResults[0].status;
  const movieStatus = getRecommendCardItemsResults[1].status;
  useEffect(() => {
    if (imageData) {
      setMalImage(imageData.data.data[0]['url']);
    }
  }, [malAnimeId, imageStatus]);

  useEffect(() => {
    if (movieData) {
      setAnimePvList(movieData.data.data);
    }
  }, [malAnimeId, movieStatus]);

  return (
    <Card withBorder radius='md' shadow='sm' key={malAnimeId}>
      <Card.Section withBorder>
        <Badge radius='md' color='cyan' py={2} mx={4} mt={4}>
          {seasonYear}-{seasonName}
        </Badge>
        <Text weight={500} size='xl' ta='left' m='xs'>
          {title}
        </Text>
      </Card.Section>

      <Carousel mx='auto' sx={{ maxWidth: 640 }} withIndicators loop slideSize='100%'>
        {facebookImgUrl && (
          <Carousel.Slide key={facebookImgUrl}>
            <AspectRatio ratio={16 / 9}>
              <Image
                src={facebookImgUrl}
                withPlaceholder
                placeholder={
                  <AspectRatio ratio={16 / 9}>
                    <Image src={`${process.env.PUBLIC_URL}/noimage.png`} fit='scale-down' />
                  </AspectRatio>
                }
                fit='scale-down'
              />
            </AspectRatio>
          </Carousel.Slide>
        )}
        {recommendImgUrl && !facebookImgUrl && (
          <Carousel.Slide key={recommendImgUrl}>
            <AspectRatio ratio={16 / 9}>
              <Image
                src={recommendImgUrl}
                withPlaceholder
                placeholder={
                  <AspectRatio ratio={16 / 9}>
                    <Image src={`${process.env.PUBLIC_URL}/noimage.png`} fit='scale-down' />
                  </AspectRatio>
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
                    sandbox='allow-scripts allow-same-origin allow-popups allow-presentation allow-top-navigation'
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
            <FaTwitter color='1D9BF0' />
            <Text hidden={!responsiveMatches} px={3}>
              Twitter
            </Text>
          </LinkButton>
          <LinkButton
            label='Annict'
            href={'https://annict.com/works/' + annictId}
            matches={responsiveMatches}
          >
            <RiCharacterRecognitionFill color='F85B73' />
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
