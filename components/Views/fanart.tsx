// components/Views/fanart.tsx
import React, { useState } from 'react';
import { Container, Table, Badge, ActionIcon, Tooltip, Group, Center, Loader } from "@mantine/core";
import { TableVirtuoso } from 'react-virtuoso';
import { notifications } from '@mantine/notifications';
import Link from 'next/link'
import { format } from 'date-fns';
import { IconRefresh, IconFolder } from '@tabler/icons-react';
import classes from './fanart.module.css';

const ListView = ({ movies, loading }) => {
    const [scrolled, setScrolled] = useState(false);

    if (loading) {
        return (
            <Container fluid mx={40} pb={25} bg="var(--mantine-color-gray-light)" style={{ height: '87vh' }}>
                <Center style={{ height: '100%' }}>
                    <Loader size="xl" type="bars" />
                </Center>
            </Container>
        );
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

    const refreshLocation = async (movieID) => {
        try {
            const response = await fetch(`http://10.0.0.21:5100/api/movie/change`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ movieID })
            });

            if (response.ok) {
                notifications.show({
                    title: 'Success',
                    message: 'Movie update library location successfully triggered.',
                    color: 'green',
                });
            } else {
                throw new Error('Failed to trigger movie library location update');
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

        <TableVirtuoso
            data={movies}
            className={classes.virttable}
            components={{
                Table: React.forwardRef((props, ref) => <Table highlightOnHover {...props} ref={ref} />),
                TableHead: Table.Thead,
                TableRow: Table.Tr,
                TableBody: React.forwardRef((props, ref) => <Table.Tbody {...props} ref={ref} />)
            }}
            fixedHeaderContent={() => (
                <Table.Tr>
                    <Table.Th w="60%" className={classes.tableHeader}>Title</Table.Th>
                    <Table.Th w={250} className={classes.tableHeader}>Studio</Table.Th>
                    <Table.Th w={200} className={classes.tableHeader}>Library</Table.Th>
                    <Table.Th w={250} className={classes.tableHeader}>Release Date</Table.Th>
                    <Table.Th w={250} className={classes.tableHeader}>Added On</Table.Th>
                    <Table.Th w={100} className={classes.tableHeader}>Resolution</Table.Th>
                    <Table.Th w={100} className={classes.tableHeader}>Size</Table.Th>
                    <Table.Th w={175} align="center" className={classes.tableHeader}>Available</Table.Th>
                    <Table.Th w={200} className={classes.tableHeader}>Options</Table.Th>
                </Table.Tr>
            )}
            itemContent={(index, movie) => (
                <React.Fragment>
                    <Table.Td className={classes.truncate}>
                        <Link href={`/library/movie/${movie.movieID}`} className={classes.link}>{movie.title}</Link>
                    </Table.Td>
                    <Table.Td className={classes.truncate}>{movie.studio}</Table.Td>
                    <Table.Td>{movie.librarySectionTitle}</Table.Td>
                    <Table.Td>{movie.originallyAvailableAt ? format(new Date(movie.originallyAvailableAt), 'PPP') : 'N/A'}</Table.Td>
                    <Table.Td>{movie.addedAt ? format(new Date(movie.addedAt * 1000), 'PPP') : 'N/A'}</Table.Td>
                    <Table.Td>{movie.videoResolution}p</Table.Td>
                    <Table.Td>{(movie.size / 1024 / 1024 / 1024).toFixed(2)} GiB</Table.Td>
                    <Table.Td align="center">{movie.exists ? <Badge color="lime" radius="sm">Available</Badge> : <Badge color="paleRed" radius="sm">Unavailable</Badge>}</Table.Td>
                    <Table.Td align="right">
                        <Group justify="flex-end">
                            <Tooltip label="Refresh Movie" position="bottom" color="gray">
                                <ActionIcon variant="subtle" color="gray" onClick={() => refreshMovie(movie.movieID)}>
                                    <IconRefresh />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Update Library" position="bottom" color="gray">
                                <ActionIcon variant="subtle" color="gray" onClick={() => refreshLocation(movie.movieID)}>
                                    <IconFolder />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Table.Td>
                </React.Fragment>
            )}
        />

    );
};

export default ListView;
