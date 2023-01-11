import { Input } from "@mantine/core";
import { AiOutlineSearch } from "react-icons/ai";
//サイトタイトルのコンポーネント
//@param onChange - 検索ボックスの中身が変更されたときに実行する関数
//@return サイトのタイトルが表示される

type Props = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchBox({ onChange }: Props) {
  return (
    <Input
      sx={{ width: 400, display: "block" }}
      icon={<AiOutlineSearch />}
      placeholder="好きなアニメを検索"
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
      variant="filled"
      size="lg"
      mb={5}
      p={5}
    />
  );
}
