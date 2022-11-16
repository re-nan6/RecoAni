import React from 'react';
import styles from './searchBox.module.css';
import { Input ,Center } from '@mantine/core';
import { AiOutlineSearch } from 'react-icons/ai';

//検索ボックスのコンポーネント
//デザインの変更をしたい

//@param onChange - 検索ボックスの内容が変更された場合に実行される関数
//@return テキストボックスが表示される

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBox: React.FC<Props> = ({onChange}) => {
  return (
      <div className={styles.box}>
        <Center>
        <Input
          sx = {{width:300, display:'block'}}
          icon={<AiOutlineSearch />}
          placeholder="好きなアニメを検索"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
        />
        </Center>
      </div>
  );
};

export default SearchBox