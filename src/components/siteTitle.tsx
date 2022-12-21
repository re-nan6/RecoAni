import React from 'react'
import styles from './siteTitle.module.css';
import LinkButton from './linkButton';
import { Title } from '@mantine/core';
import { AiOutlineSearch, AiFillGithub } from 'react-icons/ai';
import { Input ,Group } from '@mantine/core';
import { ActionIcon } from '@mantine/core';
//サイトタイトルのコンポーネント
//フォント・サイズの設定したい
//ロゴとかもほしいかも

//@return サイトのタイトルが表示される

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const SiteTitle: React.FC<Props> = ({onChange}) => {
  return (
    <Group position='apart'>
      <div className={styles.logo}>
        <Group>
          <Title order={1}>アニメレコメンド！</Title>
        </Group>
      </div>
      <div className={styles.right}>
        <Group position='right'>
          <Input
              sx = {{width:250, display:'block'}}
              icon={<AiOutlineSearch />}
              placeholder="好きなアニメを検索"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
            />
          <ActionIcon variant='default' size='lg' component='a' href='https://github.com/fastsnowx/AnimeRecommendApp-frontend' target='_blank'>
            <AiFillGithub size={25}/>
          </ActionIcon>
        </Group>
      </div>
    </Group>
  );
};

export default SiteTitle