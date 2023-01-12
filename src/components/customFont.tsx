import { Global } from '@mantine/core';

export function CustomFont() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'Noto Sans Japanese',
            fontStyle: 'normal',
            fontWeight: 300,
            src: `url(//fonts.gstatic.com/ea/notosansjapanese/v6/NotoSansJP-DemiLight.woff2) format('woff2')`,
          },
        },
      ]}
    />
  );
}
