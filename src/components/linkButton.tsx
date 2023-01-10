import React, { ReactNode } from "react";
import styles from "./linkButton.module.css";
import { Avatar, Tooltip } from "@mantine/core";

//レコメンドカード内のボタンのコンポーネント

//@param label - ボタンの詳細を表すラベル
//@param href - ボタンをクリックしたときの遷移先
//@param children - ボタンのアイコン
//@return アイコンのみのボタンが表示される

type Props = {
  label: string;
  href: string;
  children: ReactNode;
};

const LinkButton: React.FC<Props> = ({ label, href, children }) => {
  return (
    <Tooltip label={label} position="right" withArrow>
      <Avatar
        component="a"
        href={href}
        target="_blank"
        size="lg"
        className={styles.sideButton}
      >
        {children}
      </Avatar>
    </Tooltip>
  );
};

export default LinkButton;
