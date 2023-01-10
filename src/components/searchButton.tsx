import React from "react";
import { Button } from "@mantine/core";

//検索ボタンのコンポーネント
//デザインを変更したい

//@param onClick - ボタンが押されたときに行われる処理
//@return 検索ボタンが表示される

type Props = {
  onClick: () => void[];
};

const SearchButton: React.FC<Props> = ({ onClick }) => {
  return (
    <div>
      <Button variant="outline" color="gray" size="md" onClick={onClick}>
        おすすめのアニメを検索
      </Button>
    </div>
  );
};

export default SearchButton;
