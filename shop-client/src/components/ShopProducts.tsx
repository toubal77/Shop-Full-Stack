import { CategoryService, ProductService } from '../services';
import { useEffect, useState } from 'react';
import { Category, Product, ResponseArray } from '../types';
import { Box, FormControl, Grid, Pagination, Typography } from '@mui/material';
import ProductCard from './ProductCard';
import { useAppContext } from '../context';
import SelectPaginate from './SelectPaginate';
import { useTranslation } from 'react-i18next';

type Props = {
    shopId: string;
};

const ShopProducts = ({ shopId }: Props) => {
    const { t } = useTranslation();
    const { setLoading } = useAppContext();
    const [products, setProducts] = useState<Product[] | null>(null);
    const [count, setCount] = useState<number>(0);
    const [page, setPage] = useState<number>(0);
    const [pageSelected, setPageSelected] = useState<number>(0);
    const [filter, setFilter] = useState<Category | null>(null);

    const getProducts = () => {
        setLoading(true);
        let promisedProducts: Promise<ResponseArray<Product>>;

        if (filter && filter.name !== 'Toutes les catégories') {
            promisedProducts = ProductService.getProductsbyShopAndCategory(shopId, filter.id, pageSelected, 6);
        } else {
            promisedProducts = ProductService.getProductsbyShop(shopId, pageSelected, 6);
        }

        promisedProducts
            .then((res) => {
                setProducts(res.data.content);
                setCount(res.data.totalPages);
                setPage(res.data.pageable.pageNumber + 1);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        getProducts();
    }, [shopId, pageSelected, filter]);

    const handleChangePagination = (event: React.ChangeEvent<unknown>, value: number) => {
        setPageSelected(value - 1);
    };

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            {/* Filters */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}
            >
                <FormControl sx={{ minWidth: 220, flex: 1, maxWidth: 300 }}>
                    <SelectPaginate
                        value={filter}
                        onChange={setFilter}
                        placeholder="Catégorie"
                        refetch={CategoryService.getCategories}
                        defaultLabel="Toutes les catégories"
                    />
                </FormControl>
            </Box>

            <Grid container alignItems="center" rowSpacing={3} columnSpacing={3}>
                {products?.map((product) => (
                    <Grid item key={product.id} xs={8} sm={6} md={3} lg={4}>
                        <ProductCard product={product} />
                    </Grid>
                ))}
            </Grid>

            {products?.length !== 0 ? (
                <Pagination
                    count={count}
                    page={page}
                    siblingCount={1}
                    onChange={handleChangePagination}
                    sx={{ mt: 2 }}
                />
            ) : (
                <Typography variant="h6" sx={{ mt: 4 }}>
                    {t('products.list_vide')}
                </Typography>
            )}
        </Box>
    );
};

export default ShopProducts;
