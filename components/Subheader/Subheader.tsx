import { useRouter } from 'next/router';
import { Group, Burger, Container, Button, Menu, ActionIcon } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { IconEyeCog, IconCheck, IconFilter, IconArrowsSort, IconChevronUp, IconChevronDown, IconArrowLeft, IconRefresh } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import classes from './Subheader.module.css';

export function Subheader() {
    const [opened, { toggle }] = useDisclosure(false);
    const [uiSettings, setUiSettings] = useLocalStorage({
        key: 'UI',
        defaultValue: { view: 'List', filter: 'All Movies', sort: 'titleAsc' }
    });

    const handleViewChange = (newView) => {
        setUiSettings({ ...uiSettings, view: newView });
    };

    const handleFilterChange = (newFilter) => {
        setUiSettings({ ...uiSettings, filter: newFilter });
    };

    const handleSortChange = (currentSort) => {
        // Determine the current field and direction
        const field = currentSort.replace(/Asc|Desc$/, '');
        const newSortOrder = uiSettings.sort === `${field}Asc` ? `${field}Desc` : `${field}Asc`;

        // Update UI settings with the new sort order
        setUiSettings({ ...uiSettings, sort: newSortOrder });
    };

    const refreshLibrary = async (plexLibraryID) => {
        try {
            const response = await fetch(`http://10.0.0.21:5100/api/library/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ plexLibraryID })
            });

            if (response.ok) {
                notifications.show({
                    title: 'Success',
                    message: 'Movie refresh successfully triggered.',
                    color: 'green',
                });
            } else {
                throw new Error('Failed to trigger movie refresh');
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red',
            });
        }
    };

    return (
        <header className={classes.header}>
            <Container size="responsive" mx={25}>
                <div className={classes.inner}>
                    <Group>
                        <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                        <Button variant="light" color="gray" onClick={() => refreshLibrary('33')}>Refresh Library</Button>
                        <Button variant="light" color="gray">Button 2</Button>
                        <Button variant="light" color="gray">Button 3</Button>
                    </Group>

                    <Group>
                        <Group ml={50} gap={15} className={classes.links} visibleFrom="sm">
                            <Menu width={150} shadow="md">
                                <Menu.Target>
                                    <ActionIcon variant="subtle" aria-label="Views" size="lg" color="gray">
                                        <IconEyeCog />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        icon={uiSettings.view === 'Fanart' ? <IconCheck /> : null}
                                        onClick={() => handleViewChange('Fanart')}
                                        rightSection={uiSettings.view === 'Fanart' ? <IconCheck /> : null}
                                    >
                                        Fanart View
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={uiSettings.view === 'List' ? <IconCheck /> : null}
                                        onClick={() => handleViewChange('List')}
                                        rightSection={uiSettings.view === 'List' ? <IconCheck /> : null}
                                    >
                                        List View
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={uiSettings.view === 'Poster' ? <IconCheck /> : null}
                                        onClick={() => handleViewChange('Poster')}
                                        rightSection={uiSettings.view === 'Poster' ? <IconCheck /> : null}
                                    >
                                        Poster View
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                            <Menu width={200} shadow="md">
                                <Menu.Target>
                                    <ActionIcon variant="subtle" aria-label="Sort" size="lg" color="gray">
                                        <IconArrowsSort />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        onClick={() => handleSortChange('title')}
                                        rightSection={
                                            uiSettings.sort.includes('title') ? (
                                                uiSettings.sort === 'titleAsc' ? <IconChevronUp /> : <IconChevronDown />
                                            ) : null
                                        }
                                    >
                                        Title
                                    </Menu.Item>
                                    <Menu.Item
                                        onClick={() => handleSortChange('year')}
                                        rightSection={
                                            uiSettings.sort.includes('year') ? (
                                                uiSettings.sort === 'yearAsc' ? <IconChevronUp /> : <IconChevronDown />
                                            ) : null
                                        }
                                    >
                                        Year
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                            <Menu width={200} shadow="md">
                                <Menu.Target>
                                    <ActionIcon variant="subtle" aria-label="Sort" size="lg" color="gray">
                                        <IconFilter />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        icon={uiSettings.filter === 'All' ? <IconCheck /> : null}
                                        onClick={() => handleFilterChange('All')}
                                        rightSection={uiSettings.filter === 'All' ? <IconCheck /> : null}
                                    >
                                        All Movies
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={uiSettings.filter === 'Available' ? <IconCheck /> : null}
                                        onClick={() => handleFilterChange('Available')}
                                        rightSection={uiSettings.filter === 'Available' ? <IconCheck /> : null}
                                    >
                                        Available Movies
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={uiSettings.filter === 'Unavailable' ? <IconCheck /> : null}
                                        onClick={() => handleFilterChange('Unavailable')}
                                        rightSection={uiSettings.filter === 'Unavailable' ? <IconCheck /> : null}
                                    >
                                        Unavailable Movies
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>
                </div>
            </Container>
        </header>
    );
}

interface Subheader_MovieProps {
    movieID: number;
}

export function Subheader_Movie({ movieID }: Subheader_MovieProps) {
    const [opened, { toggle }] = useDisclosure(false);
    const [uiSettings, setUiSettings] = useLocalStorage({
        key: 'UI',
        defaultValue: { view: 'List', filter: 'All Movies' }
    });
    const router = useRouter();


    const handleViewChange = (newView) => {
        setUiSettings({ ...uiSettings, view: newView });
    };

    const handleFilterChange = (newFilter) => {
        setUiSettings({ ...uiSettings, filter: newFilter });
    };

    function goBack() {
        router.back();
    }

    const refreshMovie = async (movieID) => {
        try {
            const response = await fetch(`http://10.0.0.21:5100/api/movie/scan`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movieID })
            });

            if (response.ok) {
                notifications.show({
                    title: 'Success',
                    message: 'Movie refresh successfully triggered.',
                    color: 'green',
                });
            } else {
                throw new Error('Failed to trigger movie refresh');
            }
        } catch (error) {
            notifications.show({
                title: 'Error',
                message: error.message,
                color: 'red',
            });
        }
    };

    return (
        <header className={classes.header}>
            <Container size="responsive" mx={25}>
                <div className={classes.inner}>
                    <Group>
                        <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
                        <ActionIcon variant="filled" aria-label="Views" size="lg" color="gray" onClick={goBack}>
                            <IconArrowLeft />
                        </ActionIcon>
                        <Button variant="light" color="gray" onClick={() => refreshMovie(movieID)}>
                            <IconRefresh />
                        </Button>
                        <Button variant="light" color="gray">Button 3</Button>
                    </Group>

                    <Group>
                        <Group ml={50} gap={15} className={classes.links} visibleFrom="sm">
                            <Menu width={150} shadow="md">
                                <Menu.Target>
                                    <ActionIcon variant="subtle" aria-label="Views" size="lg" color="gray">
                                        <IconEyeCog />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        icon={uiSettings.view === 'Fanart' ? <IconCheck /> : null}
                                        onClick={() => handleViewChange('Fanart')}
                                        rightSection={uiSettings.view === 'Fanart' ? <IconCheck /> : null}
                                    >
                                        Fanart View
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={uiSettings.view === 'List' ? <IconCheck /> : null}
                                        onClick={() => handleViewChange('List')}
                                        rightSection={uiSettings.view === 'List' ? <IconCheck /> : null}
                                    >
                                        List View
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={uiSettings.view === 'Poster' ? <IconCheck /> : null}
                                        onClick={() => handleViewChange('Poster')}
                                        rightSection={uiSettings.view === 'Poster' ? <IconCheck /> : null}
                                    >
                                        Poster View
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                            <Menu width={200} shadow="md">
                                <Menu.Target>
                                    <ActionIcon variant="subtle" aria-label="Sort" size="lg" color="gray">
                                        <IconFilter />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        icon={uiSettings.filter === 'All' ? <IconCheck /> : null}
                                        onClick={() => handleFilterChange('All')}
                                        rightSection={uiSettings.filter === 'All' ? <IconCheck /> : null}
                                    >
                                        All Movies
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={uiSettings.filter === 'Available' ? <IconCheck /> : null}
                                        onClick={() => handleFilterChange('Available')}
                                        rightSection={uiSettings.filter === 'Available' ? <IconCheck /> : null}
                                    >
                                        Available Movies
                                    </Menu.Item>
                                    <Menu.Item
                                        icon={uiSettings.filter === 'Unavailable' ? <IconCheck /> : null}
                                        onClick={() => handleFilterChange('Unavailable')}
                                        rightSection={uiSettings.filter === 'Unavailable' ? <IconCheck /> : null}
                                    >
                                        Unavailable Movies
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>
                </div>
            </Container>
        </header>
    );
}