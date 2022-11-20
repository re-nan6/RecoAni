import React from 'react';
import styles from './sidebar.module.css';
import { FiMonitor } from 'react-icons/fi';
import { MdMonitor } from 'react-icons/md'

//検索ボックスのコンポーネント
//デザインの変更をしたい

//@param onChange - 検索ボックスの内容が変更された場合に実行される関数
//@return テキストボックスが表示される

type Props = {
  
}

const Sidebar: React.FC<Props> = () => {
  return (
      <div className={styles.box}>
        <ul>
            <li className={styles.row}>
                <div className={styles.icon}><FiMonitor/></div>
                <div className={styles.title}>今期のアニメ</div>
            </li>
            <li className={styles.row}>
                <div className={styles.icon}><MdMonitor/></div>
                <div className={styles.title}>前期のアニメ</div>
            </li>
        </ul>
      </div>
  );
};

export default Sidebar