import React from 'react'
import styles from './title.module.css';

type Props = {

}

const Title: React.FC<Props> = () => {
  return (
      <div className={styles.logo}>
         アニメレコメンド！
      </div>
  );
};

export default Title