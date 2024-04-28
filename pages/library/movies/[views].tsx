// pages/library/movies/[views].tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Subheader } from '../../../components/Subheader/Subheader';
import { useLocalStorage } from '@mantine/hooks';

const ListView = dynamic(() => import('../../../components/Views/list'));
const PosterView = dynamic(() => import('../../../components/Views/poster'));
const FanartView = dynamic(() => import('../../../components/Views/fanart'));

const MovieViews = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uiSettings] = useLocalStorage({
        key: 'UI',
        defaultValue: { view: 'List', filter: 'All', sort: 'titleAsc' }
    });

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            const response = await fetch(`http://10.0.0.21:5100/api/movie?filter=${uiSettings.filter}`);
            const data = await response.json();
            if (data && Array.isArray(data) && uiSettings.sort) {
                const sortedData = sortMovies(data, uiSettings.sort); // Apply sorting
                setMovies(sortedData);
            } else {
                setMovies(data); // Handle cases where data is not as expected or sort is missing
            }
            setLoading(false);
        };

        fetchMovies();
    }, [uiSettings.filter, uiSettings.sort]); // Re-fetch and sort when filter or sort changes

    const sortMovies = (movies, sortOrder) => {
        if (!sortOrder) {
            console.error("Sort order is undefined.");
            return movies; // Return movies unsorted if sortOrder is not provided
        }

        return movies.sort((a, b) => {
            const [key, order] = sortOrder.split(/(Asc|Desc)$/);
            const dir = order === 'Asc' ? 1 : -1;
            if (a[key] < b[key]) return -1 * dir;
            if (a[key] > b[key]) return 1 * dir;
            return 0;
        });
    };


    console.log(movies);

    const renderView = () => {
        const props = { movies, loading };
        switch (uiSettings.view) {
            case 'List':
                return <ListView {...props} />;
            case 'Poster':
                return <PosterView {...props} />;
            case 'Fanart':
                return <FanartView {...props} />;
            default:
                return <p>View not found.</p>;
        }
    };

    return (
        <>
            <Subheader />
            <div>
                {renderView()}
            </div>
        </>
    );
};

export default MovieViews;
