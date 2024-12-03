import { Box, Fab, Grid, Pagination, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategoryCard } from '../components';
import { useAppContext } from '../context';
import { CategoryService } from '../services';
import { Category } from '../types';

const Categories = () => {
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [categories, setCategories] = useState<Category[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const getCategories = () => {
        setLoading(true);
        CategoryService.getCategories(pageSelected, 9)
            .then((res) => {
                setCategories(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getCategories();
    }, [pageSelected]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant={isMobile ? 'h4' : 'h2'} textAlign="center">
                Les catégories
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: { xs: 2, sm: 3 },
                }}
            >
                <Fab variant="extended" color="primary" aria-label="add" onClick={() => navigate('/category/create')}>
                    <AddIcon sx={{ mr: 1 }} />
                    Ajouter une catégorie
                </Fab>
            </Box>

            {/* Categories */}
            <Grid container alignItems="center" rowSpacing={3} columnSpacing={3} sx={{ width: '100%' }}>
                {categories?.map((category) => (
                    <Grid item key={category.id} xs={12} sm={6} md={4}>
                        <CategoryCard category={category} />
                    </Grid>
                ))}
            </Grid>

            {/* Pagination */}
            {categories?.length !== 0 ? (
                <Pagination
                    count={count}
                    page={page}
                    siblingCount={1}
                    onChange={handleChangePagination}
                    sx={{
                        marginTop: 3,
                        '& .MuiPaginationItem-root': {
                            fontSize: { xs: '0.8rem', sm: '1rem' },
                        },
                    }}
                />
            ) : (
                <Typography variant="h5" sx={{ mt: -1 }}>
                    Aucune catégorie correspondante
                </Typography>
            )}
        </Box>
    );
};

export default Categories;
