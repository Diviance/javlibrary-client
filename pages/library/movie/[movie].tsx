// /pages/library/movie/[movie].tsx
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { Container, Button, Badge, Text, Image, Title, Group, Rating, Stack, ActionIcon } from "@mantine/core";
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import NextImage from 'next/image';
import { format } from 'date-fns';
import { Subheader_Movie } from '../../../components/Subheader/Subheader';
import styles from './movie.module.css';

interface Genre {
    tag: string;
}

interface Movie {
    movieID: number;
    title: string;
    studio: string;
    userRating: number;
    year: number;
    duration: number;  // Duration in minutes
    file: string;
    exists: boolean;
    size: number;
    Genres: Genre[];
    originallyAvailableAt: string;
    addedAt: number;
    updatedAt: number;
    deletedAt: number;
    librarySectionTitle: string;
    videoResolution: string;
    videoCodec: string;
    audioCodec: string;
    audioChannels: number;
}

interface Library {
    librarySectionID: number;
    librarySectionTitle: string;
}
interface Navigation {
    previousMovieID: number;
    nextMovieID: number;
}

interface Props {
    movie: Movie;
    navigation: Navigation;
}

const MoviePage = ({ movie, navigation }: Props) => {
    const router = useRouter();

    // Function to format duration from minutes to "Xh Ym"
    const formatDuration = (duration: number) => {
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        const hours = Math.floor((duration / (1000 * 60 * 60)));
        return `${hours}h ${minutes}m`;
    };

    // Extract directory path from the file path
    const movieDirectory = movie.file.substring(0, movie.file.lastIndexOf('/'));
    const movieFile = movie.file.substring(movie.file.lastIndexOf('/') + 1);

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    // Navigate to another movie
    const navigateToMovie = (movieID: number) => {
        router.push(`/library/movie/${movieID}`);
    };

    return (
        <>
            <Subheader_Movie movieID={movie.movieID} />
            <div className={styles.container}>
                <Button.Group className={styles.navButtons}>
                    <Button variant="default" onClick={() => navigateToMovie(navigation.previousMovieID)}><IconArrowLeft size={24} /></Button>
                    <Button variant="default" onClick={() => navigateToMovie(navigation.nextMovieID)}><IconArrowRight size={24} /></Button>
                </Button.Group>
                <Image
                    src={`http://10.0.0.21:5100/images/${movie.movieID}/fanart.webp`}
                    alt={movie.title}
                    loading="lazy"
                    className={styles.backgroundImage}
                />
                <div className={styles.imageWrapper}>
                    <NextImage
                        src={`http://10.0.0.21:5100/images/${movie.movieID}/poster.webp`}
                        alt={movie.title}
                        width={250}
                        height={375}
                        style={{ objectFit: "cover" }}
                        loading="lazy"
                        placeholder='empty'
                    />
                </div>
                <div className={styles.content}>
                    <Stack gap="md">
                        <Title order={1} fw={400} lineClamp={1}>{movie.title}</Title>
                        <Group>
                            <Badge variant="outline" color="gray" size="md" radius="sm">XXX</Badge>
                            <Badge variant="outline" color="gray" size="md" radius="sm">{movie.year}</Badge>
                            <Badge variant="outline" color="gray" size="md" radius="sm">{formatDuration(movie.duration)}</Badge>
                            <Badge variant="outline" color="gray" size="md" radius="sm">{movie.Library.librarySectionTitle}</Badge>
                        </Group>
                        <Rating fractions={2} value={movie.userRating / 2} readOnly />
                        <Group gap="lg">
                            <Stack gap={0}>
                                <Text ml={10} fz={10.5} c="dimmed">Path</Text>
                                <Badge tt="none" fz={14} fw={400} variant="transparent" color="gray" radius={0}>{movieDirectory}</Badge>
                            </Stack>
                            <Stack gap={0}>
                                <Text ml={10} fz={10.5} c="dimmed">Status</Text>
                                <Badge tt="none" fz={14} fw={400} radius={0} color={movie.exists ? 'lime' : 'paleRed'} variant="transparent">
                                    {movie.exists ? 'Available' : 'Unavailable'}
                                </Badge>
                            </Stack>
                            <Stack gap={0}>
                                <Text ml={10} fz={10.5} c="dimmed">Size</Text>
                                <Badge tt="none" fz={14} fw={400} variant="transparent" color="gray" radius={0}>{(movie.size / 1024 / 1024 / 1024).toFixed(2)} GiB</Badge>
                            </Stack>
                            <Stack gap={0}>
                                <Text ml={10} fz={10.5} c="dimmed">Studio</Text>
                                <Badge tt="none" fz={14} fw={400} variant="transparent" color="gray" radius={0}>{movie.studio}</Badge>
                            </Stack>
                            <Stack gap={0}>
                                <Text ml={10} fz={10.5} c="dimmed">Genres</Text>
                                <Group gap={0}>
                                    {movie.Genres.map(genre => (
                                        <Badge tt="none" fz={14} fw={400} key={genre.tag} color="blue" variant="subtle" radius={0}>{genre.tag}</Badge>
                                    ))}
                                </Group>
                            </Stack>
                        </Group>
                        <Group gap="lg">
                            <Stack gap={0}>
                                <Text ml={10} fz={10.5} c="dimmed">Release</Text>
                                <Badge tt="none" fz={14} fw={400} variant="transparent" color="gray" radius={0}>
                                    {movie.originallyAvailableAt}
                                </Badge>
                            </Stack>
                            <Stack gap={0}>
                                <Text ml={10} fz={10.5} c="dimmed">Added</Text>
                                <Badge tt="none" fz={14} fw={400} radius={0} color="gray" variant="transparent">
                                    {movie.addedAt ? format(new Date(movie.addedAt * 1000), 'PPP') : 'N/A'}
                                </Badge>
                            </Stack>
                            <Stack gap={0}>
                                <Text ml={10} fz={10.5} c="dimmed">Updated</Text>
                                <Badge tt="none" fz={14} fw={400} variant="transparent" color="gray" radius={0}>
                                    {movie.updatedAt ? format(new Date(movie.updatedAt * 1000), 'PPP') : 'N/A'}
                                </Badge>
                            </Stack>
                            {!movie.exists && (
                                <Stack gap={0}>
                                    <Text ml={10} fz={10.5} c="dimmed">Deleted At</Text>
                                    <Badge tt="none" fz={14} fw={400} variant="transparent" color="gray" radius={0}>
                                        {movie.deletedAt ? format(new Date(movie.deletedAt * 1000), 'PPP') : 'N/A'}
                                    </Badge>
                                </Stack>
                            )}
                        </Group>
                    </Stack>
                </div>
            </div>
            <Container fluid mx={40} mt={25} p={10} bg="gray.8" className={styles.fileContainer}>
                <Group gap="lg" justify="space-between" mr={10}>
                    <Stack gap={5}>
                        <Text ml={10} fz={14} fw={600} c="gray">Filename</Text>
                        <Badge tt="none" fz={14} fw={400} variant="transparent" color="gray" radius={0}>{movieFile}</Badge>
                    </Stack>
                    <Stack gap={5}>
                        <Text ml={10} fz={14} fw={600} c="gray">Video Codec</Text>
                        <Badge fz={14} fw={400} radius={0} color="gray" variant="transparent">
                            {movie.videoCodec}
                        </Badge>
                    </Stack>
                    <Stack gap={5}>
                        <Text ml={10} fz={14} fw={600} c="gray">Video Bitrate</Text>
                        <Badge tt="none" fz={14} fw={400} variant="transparent" color="gray" radius={0}>{movie.bitrate} kbps</Badge>
                    </Stack>
                    <Stack gap={5}>
                        <Text ml={10} fz={14} fw={600} c="gray">Audio Info</Text>
                        <Badge fz={14} fw={400} variant="transparent" color="gray" radius={0}>{movie.audioCodec} - {movie.audioChannels}.0</Badge>
                    </Stack>
                    <Stack gap={5}>
                        <Text fz={14} c="gray" fw={600}>Languages</Text>
                        <Badge tt="none" fz={14} fw={400} variant="light" color="gray" radius="md">Japanese</Badge>
                    </Stack>
                    <Stack gap={5}>
                        <Text fz={14} c="gray" fw={600}>Resolution</Text>
                        <Badge tt="none" fz={14} fw={500} color="blue" variant="light" radius="md">{movie.videoResolution}p</Badge>
                    </Stack>
                </Group>
            </Container>
        </>
    );
};

export default MoviePage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { movie } = context.params;

    try {
        const res = await fetch(`http://10.0.0.21:5100/api/movie/${movie}`);
        const movieData = await res.json();
        const navRes = await fetch(`http://10.0.0.21:5100/api/movie/navigation/${movie}`);
        const navigationData = await navRes.json();

        if (!res.ok || !navRes.ok) {
            throw new Error(`Failed to fetch data, received status ${res.status}`);
        }

        return { props: { movie: movieData, navigation: navigationData } };
    } catch (error) {
        console.error("Error fetching movie data:", error.message);
        return { notFound: true };
    }
};