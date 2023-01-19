import {
  useMantineColorScheme,
  SegmentedControl,
  Group,
  Center,
  Box,
  ActionIcon,
} from '@mantine/core';
import { BsMoon, BsSun } from 'react-icons/bs';
import { AiFillGithub } from 'react-icons/ai';
import { ReactElement } from 'react';

export function SegmentedToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <Group position='center' my='xl'>
      <SegmentedControl
        value={colorScheme}
        onChange={(value: 'light' | 'dark') => toggleColorScheme(value)}
        data={[
          {
            value: 'light',
            label: (
              <Center>
                <BsSun size={16} />
                <Box ml={10}>Light</Box>
              </Center>
            ),
          },
          {
            value: 'dark',
            label: (
              <Center>
                <BsMoon size={16} />
                <Box ml={10}>Dark</Box>
              </Center>
            ),
          },
        ]}
      />
    </Group>
  );
}

export function ActionToggleThemeButton(): ReactElement {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <ActionIcon
      variant='light'
      size='lg'
      onClick={() => toggleColorScheme()}
      title='Toggle color scheme'
    >
      {dark ? <BsSun size={20} /> : <BsMoon size={20} />}
    </ActionIcon>
  );
}

export function GithubIcon(): ReactElement {
  return (
    <ActionIcon
      variant='light'
      size='lg'
      component='a'
      target='_blank'
      href='https://github.com/re-nan6/RecoAni'
      title='Source code'
    >
      <AiFillGithub size={22} />
    </ActionIcon>
  );
}
