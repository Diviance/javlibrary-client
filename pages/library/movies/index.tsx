// pages/movies/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const MoviesIndex = () => {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the preferred default view
        router.replace('/library/movies/view');
    }, [router]);

    return <div>Loading your default movie view...</div>;
}

export default MoviesIndex;