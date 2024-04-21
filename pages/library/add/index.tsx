import { useEffect, useState } from 'react';
import { Container, Card, Text, Button, Group, Grid, Title, Overlay } from "@mantine/core";
import { format } from 'date-fns';

export default function LibraryAddNew() {
    const [libraries, setLibraries] = useState([]);
    const [dbLibraries, setDbLibraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseURL = 'http://10.0.0.21:5100';

    useEffect(() => {
        async function fetchData() {
            try {
                const plexResponse = await fetch(`${baseURL}/api/plex/libraries`);
                if (!plexResponse.ok) throw new Error('Failed to fetch from Plex');

                const plexData = await plexResponse.json();
                const directories = plexData.MediaContainer.Directory.map(dir => ({
                    ...dir.$,
                    location: dir.Location && dir.Location[0].$ ? dir.Location[0].$.path : "No location",
                    updatedAt: format(new Date(parseInt(dir.$.updatedAt) * 1000), 'PPPppp')
                }));

                const dbResponse = await fetch(`${baseURL}/api/library/list`);
                if (!dbResponse.ok) throw new Error('Failed to fetch library list');

                const dbData = await dbResponse.json();

                setLibraries(directories);
                setDbLibraries(dbData);
                setLoading(false);
                console.log("Database Libraries:", dbData);
            } catch (error) {
                console.error('Error:', error);
                setError(error.message);
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleAddLibrary = async (library) => {
        const response = await fetch(`${baseURL}/api/library/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ librarySectionID: library.key, librarySectionTitle: library.title })
        });

        if (response.ok) {
            const addedLibrary = await response.json();
            setDbLibraries([...dbLibraries, addedLibrary]);
        } else {
            console.error('Failed to add library');
        }
    };

    const handleRemoveLibrary = async (library) => {
        const response = await fetch(`${baseURL}/api/library/remove`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ librarySectionID: library.key })
        });

        if (response.ok) {
            // Remove the library from dbLibraries state to update the UI
            setDbLibraries(current => current.filter(lib => lib.librarySectionID.toString() !== library.key));
        } else {
            console.error('Failed to remove library');
        }
    };

    return (
        <Container size="150rem" style={{ marginTop: 25 }}>
            <Grid>
                {loading && <Text>Loading...</Text>}
                {error && <Text color="red">{error}</Text>}
                {!loading && !error && libraries.map((library, index) => (
                    <Grid.Col span={3} key={index}>
                        <Card shadow="sm" padding="lg" style={{ marginBottom: 20, position: 'relative' }}>

                            <Title order={1}>{library.title}</Title>
                            <Text size="sm">ID: {library.key}</Text>
                            <Text size="sm">Path: {library.location}</Text>
                            <Text size="sm">Updated: {library.updatedAt}</Text>
                            <Group justify="center" style={{ marginTop: 14 }}>
                                {dbLibraries.some(dbLib => dbLib.librarySectionID.toString() === library.key) ? (
                                    <Button variant="filled" color="red" onClick={() => handleRemoveLibrary(library)}>Remove</Button>
                                ) : (
                                    <Button variant="filled" color="lime" onClick={() => handleAddLibrary(library)}>Add</Button>
                                )}
                            </Group>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </Container>
    );
}
