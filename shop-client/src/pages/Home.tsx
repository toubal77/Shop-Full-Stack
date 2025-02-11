import {
    Box,
    Fab,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Pagination,
    Select,
    SelectChangeEvent,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filters, ShopCard } from '../components';
import { useAppContext } from '../context';
import { ShopService } from '../services';
import { ResponseArray, Shop } from '../types';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const [shops, setShops] = useState<Shop[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);

    const [sort, setSort] = useState<string>('');
    const [filters, setFilters] = useState<string>('');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const getShops = () => {
        setLoading(true);
        let promisedShops: Promise<ResponseArray<Shop>>;
        if (sort) {
            promisedShops = ShopService.getShopsSorted(pageSelected, 9, sort);
        } else if (filters) {
            promisedShops = ShopService.getShopsFiltered(pageSelected, 9, filters);
        } else {
            promisedShops = ShopService.getShops(pageSelected, 9);
        }
        promisedShops
            .then((res) => {
                setShops(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getShops();
    }, [pageSelected, sort, filters]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    const handleChangeSort = (event: SelectChangeEvent) => {
        setSort(event.target.value as string);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant={isMobile ? 'h4' : 'h2'} textAlign="center">
                {t('home.title')}
            </Typography>

            <Box
                sx={{
                    width: '100%', display: 'flex', flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: isMobile ? 'center' : 'flex-end', alignItems: 'center', gap: 2,
                }}
            >
                <Fab
                    variant="extended" color="primary" aria-label="add"
                    onClick={() => navigate('/shop/create')}
                    sx={{
                        width: isMobile ? '100%' : 'auto',
                    }}
                >
                    <AddIcon sx={{ mr: 1 }} />
                    {t('home.LBL_ADD_SHOP')}
                </Fab>
            </Box>

            {/* Sort and filters */}
            <Box
                sx={{
                    width: '100%', display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    justifyContent: 'space-between',
                    alignItems: isMobile ? 'stretch' : 'center',
                    gap: 2,
                }}
            >
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-label">{t('home.filters.trier_par')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={sort}
                        label="Trier par"
                        onChange={handleChangeSort}
                    >
                        <MenuItem value="">
                            <em>{t('home.filters.default_value')}</em>
                        </MenuItem>
                        <MenuItem value="name">{t('home.filters.name')}</MenuItem>
                        <MenuItem value="createdAt">{t('home.filters.createdAt')}</MenuItem>
                        <MenuItem value="nbProducts">{t('home.filters.nbProducts')}</MenuItem>
                    </Select>
                </FormControl>

                <Filters setUrlFilters={setFilters} setSort={setSort} sort={sort} />
            </Box>

            {/* Shops */}
            <Grid container alignItems="center" rowSpacing={3} columnSpacing={3} sx={{ width: '100%' }}>
                {shops && shops.length > 0 ? (
                    shops.map((shop) => (
                        <Grid item key={shop.id} xs={12} sm={6} md={4}>
                            <ShopCard shop={shop} />
                        </Grid>
                    ))
                ) : (
                    <Grid item xs={12} sx={{ textAlign: 'center', marginTop: 3 }}>
                        <Typography variant="h6" color="textSecondary">
                            Aucune boutique trouvée
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {/* Pagination */}
            {shops?.length !== 0 ? (
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
                    t('home.list_vide')
                </Typography>
            )}
        </Box>
    );
};

export default Home;
