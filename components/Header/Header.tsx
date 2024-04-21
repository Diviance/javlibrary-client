'use client';

import { Menu, Group, Center, Burger, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconChevronDown } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './Header.module.css';
import Link from 'next/link';

const links = [
    { link: '/', label: 'Home' },
    {
        link: '#Library',
        label: 'Library',
        links: [
            { link: '/library/add', label: 'Add New' },
            { link: '/library/maintenance', label: 'Maintenance' },
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
    {
        link: '#Settings',
        label: 'Settings',
        links: [
            { link: '/settings/library', label: 'Library Settings' },
            { link: '/settings/job', label: 'Job Settings' },
        ],
    },
];

export function Header() {
    const [opened, { toggle }] = useDisclosure(false);

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
                    <MantineLogo size={28} />
                    <Group gap={5} visibleFrom="sm">
                        {items}
                    </Group>
                    <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                </div>
            </Container>
        </header>
    );
}