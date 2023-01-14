import React from 'react';
import { Button } from '@mantine/core';

//検索ボタンのコンポーネント
//デザインを変更したい

//@param onClick - ボタンが押されたときに行われる処理
//@return 検索ボタンが表示される

type Props = {
  onClick: () => void[];
};

export const SearchButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button variant='light' color='pink' size='md' onClick={onClick}>
      おすすめのアニメを表示
    </Button>
  );
};
