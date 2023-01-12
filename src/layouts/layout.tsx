import React, { ReactElement, useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { Group, MediaQuery, Burger, Title, AppShell, Navbar, Header } from '@mantine/core';
import { ActionIcon, Image } from '@mantine/core';
import { RiVipCrownFill } from 'react-icons/ri';
import { HiFire } from 'react-icons/hi';
import { GiPalmTree } from 'react-icons/gi';
type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

const [navbarOpened, setNavbarOpened] = useState(false);
//ヘッダーのコンポーネント
const LayoutHeader = () => {
  return (
    <Header height={{ base: 60, md: 70 }}>
      <Group>
        <Group position='left'>
          <MediaQuery largerThan='sm' styles={{ display: 'none' }}>
            <Burger
              opened={navbarOpened}
              onClick={() => setNavbarOpened((o) => !o)}
              size='md'
              color='black'
              mr='xl'
            ></Burger>
          </MediaQuery>
          <Image src={`${process.env.PUBLIC_URL}/logo.png`} height={50} width={50} />
          <Title order={1}>RecoAni</Title>
        </Group>
        <Group position='right'>
          <ActionIcon
            variant='default'
            size='lg'
            component='a'
            href='https://github.com/re-nan6/RecoAni'
            target='_blank'
          >
            <AiFillGithub size={25} />
          </ActionIcon>
        </Group>
      </Group>
    </Header>
  );
};

// ナビゲーションバーのコンポーネント

const LayoutNavbar = () => {
  return (
    <Navbar width={{ sm: 100, md: 170, lg: 200 }} hiddenBreakpoint='sm' hidden={!navbarOpened}>
      <Navbar.Section>今期</Navbar.Section>
      <Navbar.Section>今期</Navbar.Section>
      <Navbar.Section>今期</Navbar.Section>
    </Navbar>
  );
};

export function Layout({ children }: LayoutProps) {
  return (
    <AppShell header={<LayoutHeader />} navbar={<LayoutNavbar />}>
      {children}
    </AppShell>
  );
}
