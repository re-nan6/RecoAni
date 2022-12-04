import React from 'react'
import styles from './recommendCard.module.css';
import { Card, Image, Text, Group, NavLink, Tooltip} from '@mantine/core'
//サイトタイトルのコンポーネント
//フォント・サイズの設定したい
//ロゴとかもほしいかも

//@return サイトのタイトルが表示される

type Props = {
    annictId:number
    title:string
}

const RecommendCard: React.FC<Props> = ({annictId,title}) => {
  return (
    <div className={styles.card}>
        <Card withBorder radius="md" p={0} shadow="sm">
            <Group noWrap spacing={0}>
                {title}
                {annictId}
            </Group>
        </Card>
    </div>
  );
};

export default RecommendCard