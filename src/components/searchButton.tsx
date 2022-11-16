import React from 'react'
import styles from './searchButton.module.css';
import { Button } from '@mantine/core';

//検索ボタンのコンポーネント
//デザインを変更したい

//@return 検索ボタンが表示される

type Props = {
  onClick:() => void[];
}

const SearchButton: React.FC<Props> = ({onClick}) => {
  return (
    <div>
      <Button variant="outline" color="gray" size="md" onClick={onClick}>
        おすすめのアニメを検索
      </Button>
    </div>
  );
};

export default SearchButton