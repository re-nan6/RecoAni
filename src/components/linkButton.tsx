import React, { ReactNode } from 'react';
import styles from './linkButton.module.css';
import { Avatar, Button, Tooltip } from '@mantine/core';

//レコメンドカード内のボタンのコンポーネント

//@param label - ボタンの詳細を表すラベル
//@param href - ボタンをクリックしたときの遷移先
//@param children - ボタンのアイコン
//@return アイコンのみのボタンが表示される

type Props = {
  label: string;
  href: string;
  children: ReactNode;
  matches: boolean;
};

const LinkButton: React.FC<Props> = ({ label, href, children, matches }) => {
  return (
    <Tooltip label={label} position='right' withArrow hidden={matches}>
      <Button
        component='a'
        href={href}
        target='_blank'
        size='md'
        // className={styles.sideButton}
        variant='subtle'
        color='gray'
        p={3}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

export default LinkButton;
