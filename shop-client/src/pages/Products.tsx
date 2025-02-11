import { Box, Fab, Grid, Pagination, Typography, useMediaQuery, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../components';
import { useAppContext } from '../context';
import { ProductService } from '../services';
import { Product } from '../types';
import { useTranslation } from 'react-i18next';

const Products = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [products, setProducts] = useState<Product[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getProducts = () => {
        setLoading(true);
        ProductService.getProducts(pageSelected, 9)
            .then((res) => {
                setProducts(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getProducts();
    }, [pageSelected]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: { xs: 2, sm: 3, md: 4 } }}>
            <Typography variant={isMobile ? 'h4' : 'h2'} textAlign="center">
                {t('products.title')}
            </Typography>

            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    padding: { xs: 2, sm: 3 },
                }}
            >
                <Fab variant="extended" color="primary" aria-label="add" onClick={() => navigate('/product/create')}>
                    <AddIcon sx={{ mr: 1 }} />
                    {t('products.LBL_ADD_PRODUCT')}
                </Fab>
            </Box>

            {/* Products */}
            <Grid container alignItems="center" rowSpacing={3} columnSpacing={3} sx={{ width: '100%' }}>
                {products && products.length > 0 ? (
                    products?.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                            <ProductCard product={product} displayShop={true} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 3 }}>
                        <Typography variant="h6" color="textSecondary">
                            Aucun Produit trouvée
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {/* Pagination */}
            {products?.length !== 0 ? (
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
                    {t('products.list_vide')}
                </Typography>
            )}
        </Box>
    );
};

export default Products;
