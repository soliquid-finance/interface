import { Logo } from '@/components/logo';
import { Outlet, Link } from 'react-router-dom';
import { AppShell, Burger, Group, } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Box } from '@mantine/core';
import { SearchBar } from '@/components/SearchBar';
import { SearchMenu } from '@/layouts/main/header/search-menu';
import ConnectButton from '../header/ConnectButton';
import AppSettingButton from '../header/AppSettingButton';

export function RootLayout() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 0, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header bd={'none'}>
        <Group h="100%" px="md" justify="space-between" align="center" style={{ position: 'relative' }}>
          <Group>
            <Link to="/"> {/* Make logo clickable */}
              <Logo />
            </Link>
          </Group>
          <Box
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1, // Ensure it stays above other elements
            }}
          >
            <SearchBar
              placeholder="Search tokens or CA"
              spotlight={<SearchMenu />}
            />
          </Box>
          <Group>
            <AppSettingButton />
            <ConnectButton />
            {/* <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" /> Move Burger to the right */}
          </Group>
        </Group>
      </AppShell.Header>
      {/* <AppShell.Navbar p="md" id="sidebar" >
        <Group ml={50} gap={5} className={classes.links}>
          {items}
        </Group>
      </AppShell.Navbar> */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
