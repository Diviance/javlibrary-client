import { useEffect, useState } from 'react';
import { Container, Text, Button, Table, Popover, Center } from "@mantine/core";
import { modals } from '@mantine/modals';
import { format } from 'date-fns';
import classes from './add.module.css';

export default function LibraryAddNew() {
    const [libraries, setLibraries] = useState([]);
    const [dbLibraries, setDbLibraries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [opened, setOpened] = useState(false);
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
                    updatedAt: format(new Date(parseInt(dir.$.updatedAt) * 1000), 'PPP')
                })).sort((a, b) => a.title.localeCompare(b.title));  // Sort directories alphabetically by title

                const dbResponse = await fetch(`${baseURL}/api/library/list`);
                if (!dbResponse.ok) throw new Error('Failed to fetch library list');

                const dbData = await dbResponse.json();

                setLibraries(directories);
                setDbLibraries(dbData);
                setLoading(false);
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
            body: JSON.stringify({ librarySectionID: library.key, librarySectionTitle: library.title, libraryPath: library.location })
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
            setOpened((o) => !o)
        } else {
            console.error('Failed to remove library');
        }
    };

    const openDeleteModal = (library) => {
        modals.openConfirmModal({
            title: `Delete Library: ${library.title}`,
            centered: true,
            children: (
                <Text size="sm">Are you sure you want to delete this library? It cannot be undone.</Text>
            ),
            labels: { confirm: `Delete ${library.title}`, cancel: "Cancel" },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => handleRemoveLibrary(library),
        });
    };

    return (
        <Container size="150rem" bg="var(--mantine-color-gray-light)" h='100%' p={25}>
            <Table striped highlightOnHover>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th className={classes.tableHeader}>Title</Table.Th>
                        <Table.Th className={classes.tableHeader}>Studio</Table.Th>
                        <Table.Th className={classes.tableHeader}>Library</Table.Th>
                        <Table.Th className={classes.tableHeader}>Release Date</Table.Th>
                        <Table.Th className={classes.tableHeader}>Added On</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {loading && <Table.Tr><Table.Td>Loading...</Table.Td></Table.Tr>}
                    {error && <Table.Tr color="red">{error}</Table.Tr>}
                    {!loading && !error && libraries.map((library, index) => (

                        <Table.Tr key={library.key}>
                            <Table.Td>{library.title}</Table.Td>
                            <Table.Td>{library.key}</Table.Td>
                            <Table.Td>{library.location}</Table.Td>
                            <Table.Td>{library.updatedAt}</Table.Td>
                            <Table.Td>
                                {dbLibraries.some(dbLib => dbLib.librarySectionID.toString() === library.key) ? (
                                    <Button variant="filled" color="red" onClick={() => openDeleteModal(library)}>Remove</Button>
                                ) : (
                                    <Button variant="filled" color="lime" onClick={() => handleAddLibrary(library)}>Add</Button>
                                )}
                            </Table.Td>
                        </Table.Tr>
                    ))}
                </Table.Tbody>
            </Table>
        </Container>
    );
}
