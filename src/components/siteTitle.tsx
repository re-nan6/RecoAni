import React from 'react'
import styles from './siteTitle.module.css';
import { Title } from '@mantine/core';

//サイトタイトルのコンポーネント
//フォント・サイズの設定したい
//ロゴとかもほしいかも

//@return サイトのタイトルが表示される

type Props = {

}

const SiteTitle: React.FC<Props> = () => {
  return (
      <div className={styles.logo}>
         <Title order={1}>アニメレコメンド！</Title>
      </div>
  );
};

export default SiteTitle