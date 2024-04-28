'use client';

import { Menu, Group, Center, Burger, Container, useMantineColorScheme, ActionIcon, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown, IconSun, IconMoon } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import cx from 'clsx';
import classes from './Header.module.css';
import Link from 'next/link';

const links = [
    { link: '/', label: 'Home' },
    {
        link: '/library/movies',
        label: 'Library',
        links: [
            { link: '/library/add', label: 'Add New' },
        ],
    },
    {
        link: '#Status',
        label: 'Status',
        links: [
            { link: '/status/torrents', label: 'Torrents' },
            { link: '/status/concatenation', label: 'Concatenation' },
            { link: '/status/libraries', label: 'Libraries' },
        ],
    },
];

export function Header() {
    const [opened, { toggle }] = useDisclosure(false);
    const { toggleColorScheme } = useMantineColorScheme();
    const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

    const toggleTheme = () => {
        toggleColorScheme(); // This will toggle between 'light' and 'dark'
    };

    const items = links.map((link) => {
        const menuItems = link.links?.map((item) => (
            <Menu.Item component={Link} href={item.link} key={item.link}>{item.label}</Menu.Item>
        ));

        if (menuItems) {
            return (
                <Menu key={link.label} trigger="hover" transitionProps={{ exitDuration: 0 }} withinPortal>
                    <Menu.Target>
                        <Link
                            href={link.link}
                            className={classes.link}
                        >
                            <Center>
                                <span className={classes.linkLabel}>{link.label}</span>
                                <IconChevronDown size="0.9rem" stroke={1.5} />
                            </Center>
                        </Link>
                    </Menu.Target>
                    <Menu.Dropdown>{menuItems}</Menu.Dropdown>
                </Menu>
            );
        }

        return (
            <Link
                key={link.label}
                href={link.link}
                className={classes.link}
            >
                {link.label}
            </Link>
        );
    });

    return (
        <header className={classes.header}>
            <Container size="responsive" mx={25}>
                <div className={classes.inner}>
                    <Link href="/">
                        <MantineLogo size={28} />
                    </Link>
                    <Group gap={5} visibleFrom="sm">
                        {items}
                        <ActionIcon variant="transparent" color="gray" onClick={toggleTheme}>
                            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
                            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
                        </ActionIcon>
                    </Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                </div>
            </Container>
        </header>
    );
}