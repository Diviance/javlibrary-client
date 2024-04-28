import { useState, useEffect, forwardRef } from 'react';
import { Container, Badge, Text, Center, Loader, Card, Group, ActionIcon } from "@mantine/core";
import { VirtuosoGrid } from 'react-virtuoso';
import Image from 'next/image';
import Link from 'next/link'
import { notifications } from '@mantine/notifications';
import { format } from 'date-fns';
import { IconRefresh } from '@tabler/icons-react';
import classes from './poster.module.css';

const PosterView = ({ movies, loading }) => {

    if (loading) {
        return (
            <Container fluid mx={40} pb={25} style={{ height: '87vh' }}>
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

    const gridComponents = {
        List: forwardRef(({ style, children, ...props }, ref) => (
            <div
                ref={ref}
                {...props}
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                    gap: '10px', // spacing between items
                    ...style,
                }}
            >
                {children}
            </div>
        )),
        Item: ({ children, ...props }) => (
            <div
                {...props}
                style={{
                    width: 'calc(100% / 12 - 10px)', // adjust width for 12 items per row
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {children}
            </div>
        )
    };

    return (
        <Container fluid py={25} bg="var(--mantine-color-gray-light)">
            <VirtuosoGrid
                totalCount={movies.length}
                components={gridComponents} // apply custom components for grid layout
                overscan={96}
                className={classes.virttable} // Adjust height as needed
                itemContent={(index) => {
                    const movie = movies[index];
                    return (
                        <Card className={classes.card} shadow="sm" bg="gray.9">
                            <Card.Section className={classes.cardContainer}>
                                <Link href={`/library/movie/${movie.movieID}`}>
                                    <div style={{ position: 'relative', width: '100%', height: 0, paddingTop: '150%' }} className={classes.imageOverlay}>
                                        <Image
                                            src={`http://10.0.0.21:5100/images/${movie.movieID}/poster.webp`}
                                            alt={movie.title}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            loading="lazy"
                                            placeholder='blur'
                                            blurDataURL={movie.poster || ''}
                                            sizes="(max-width: 599px) 100vw, 
                                                    (min-width: 600px) and (max-width: 767px) 540px, 
                                                    (min-width: 768px) and (max-width: 991px) 720px, 
                                                    (min-width: 992px) and (max-width: 1199px) 960px, 
                                                    (min-width: 1200px) and (max-width: 1399px) 1140px, 
                                                    (min-width: 1400px) 100vw"
                                        />
                                    </div>
                                </Link>
                                <ActionIcon
                                    variant="transparent"
                                    color="gray.2"
                                    onClick={(event) => {
                                        event.stopPropagation(); // Stop the event from bubbling up to the link
                                        refreshMovie(movie.movieID);
                                    }}
                                    className={classes.refreshButton}
                                >
                                    <IconRefresh size={24} />
                                </ActionIcon>
                            </Card.Section>
                            <Card.Section className={classes.infoSection}>
                                <Badge fullWidth radius={0} color={movie.exists ? 'lime' : 'paleRed'} variant="filled">
                                    {movie.exists ? 'Available' : 'Unavailable'}
                                </Badge>
                                <Text size="xs" weight={500} mt="2" truncate="end">
                                    <Link className={classes.link} href={`/library/movie/${movie.movieID}`}>
                                        {movie.title}
                                    </Link>
                                </Text>
                                <Group justify="space-between" my={3}>
                                    <Text size="xs" color="dimmed">{movie.librarySectionTitle}</Text>
                                    <Text size="xs" color="dimmed" align="right">
                                        Added: {format(new Date(movie.addedAt * 1000), 'P')}
                                    </Text>
                                </Group>
                            </Card.Section>
                        </Card>
                    );
                }}
            />
        </Container>
    );
};

export default PosterView;