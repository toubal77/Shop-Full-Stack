import { Box, Button, Divider, FormControl, InputAdornment, Paper, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SelectPaginate } from '../components';
import { useAppContext, useToastContext } from '../context';
import { CategoryService, ProductService, ShopService } from '../services';
import { MinimalProduct } from '../types';
import Locale from '../types/locale';
import { formatterProductForm, getLocalizedProduct } from '../utils';
import { useTranslation } from 'react-i18next';

const schema = (product: MinimalProduct, t: any) => ({
    nameFr: product.localizedProducts[0].name ? '' : t('products.form.champ_requis'),
    nameEn:
        !product.localizedProducts[1].name && !!product.localizedProducts[1].description
            ? t('products.form.champ_requis_description')
            : '',
    price: product.price >= 0 ? '' : t('products.form.champ_requis_price'),
});

const ProductForm = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const { setToast } = useToastContext();
    const [errors, setErrors] = useState<any>({});
    const [product, setProduct] = useState<MinimalProduct>({
        price: 0,
        shop: null,
        categories: [],
        localizedProducts: [
            {
                locale: Locale.FR,
                name: '',
                description: '',
            },
            {
                locale: Locale.EN,
                name: '',
                description: '',
            },
        ],
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablette = useMediaQuery(theme.breakpoints.down('md'));

    const getProduct = (productId: string) => {
        setLoading(true);
        ProductService.getProduct(productId)
            .then((res) => {
                if (res.data.localizedProducts.length < 2) {
                    const localizedProducts = [
                        ...res.data.localizedProducts,
                        { locale: Locale.EN, name: '', description: '' },
                    ];
                    setProduct({ ...res.data, id: id, localizedProducts });
                } else {
                    setProduct({ ...res.data, id: id });
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        !isAddMode && id && getProduct(id);
    }, [isAddMode]);

    const createProduct = (productToCreate: MinimalProduct) => {
        setLoading(true);
        ProductService.createProduct(productToCreate)
            .then(() => {
                navigate('/product');
                setToast({ severity: 'success', message: 'Le produit a bien été créé' });
            })
            .catch(() => {
                setToast({ severity: 'error', message: 'Une erreur est survenue lors de la création' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const editProduct = (productToEdit: MinimalProduct) => {
        setLoading(true);
        ProductService.editProduct(productToEdit)
            .then(() => {
                navigate(`/product/${id}`);
                setToast({ severity: 'success', message: 'Le produit a bien été modifié' });
            })
            .catch(() => {
                setToast({ severity: 'error', message: 'Une erreur est survenue lors de la modification' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validate = () => {
        const validationErrors = schema(product, t);
        setErrors(validationErrors);
        return Object.values(validationErrors).every((o) => o === "");
    };

    const handleSubmit = () => {
        if (!validate()) return;
        const formatizedProduct = formatterProductForm(product);
        if (isAddMode) {
            createProduct(formatizedProduct);
        } else {
            editProduct(formatizedProduct);
        }
    };

    const handleChange = (locale: Locale, key: string, value: string) => {
        const localizedProduct = getLocalizedProduct(product.localizedProducts, locale);
        const newLocalizedProduct = {
            ...localizedProduct,
            [key]: value,
        };
        const newLocalizedProducts = product.localizedProducts.map((o) =>
            Object.values(o).includes(locale) ? newLocalizedProduct : o,
        );
        setProduct({ ...product, localizedProducts: newLocalizedProducts });
    };

    const setPrice = (price: string) => {
        const convertedPrice = parseFloat(price);
        if (Number.isNaN(convertedPrice)) {
            setProduct({ ...product, price: 0 });
            return;
        }
        setProduct({ ...product, price: Number(convertedPrice.toFixed(2)) });
    };

    const setShop = (shop: any) => {
        const newShop = shop.name === 'Aucune' ? null : shop;
        setProduct({ ...product, shop: newShop });
    };

    const setCategories = (categories: any) => {
        const newCategories = categories;
        setProduct({ ...product, categories: newCategories });
    };

    return (
        <Paper elevation={1} sx={{ padding: 4 }}>
            <Typography variant={isMobile ? "h4" : isTablette ? "h3" : "h2"} sx={{ marginBottom: 3, textAlign: 'center' }}>
                {isAddMode ? t('products.form.ADD_PRODUCT') : t('products.form.EDIT_PRODUCT')}
            </Typography>

            <FormControl sx={{ display: 'block', ml: 'auto', mr: 'auto', width: isMobile ? '100%' : '75%', mb: 3 }}>
                <Divider>{t('products.form.nom_product')}</Divider>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4, mt: 2, mb: 6 }}>
                    <TextField
                        autoFocus
                        required
                        label="Nom en français"
                        value={getLocalizedProduct(product.localizedProducts, Locale.FR).name}
                        onChange={(e) => handleChange(Locale.FR, 'name', e.target.value)}
                        fullWidth
                        error={!!errors.nameFr}
                        helperText={errors.nameFr}
                        sx={{ width: isMobile ? '100%' : '50%' }}
                    />
                    <TextField
                        autoFocus
                        label="Nom en anglais"
                        value={getLocalizedProduct(product.localizedProducts, Locale.EN).name}
                        onChange={(e) => handleChange(Locale.EN, 'name', e.target.value)}
                        fullWidth
                        error={!!errors.nameEn}
                        helperText={errors.nameEn}
                        sx={{ width: isMobile ? '100%' : '50%' }}
                    />
                </Box>

                <Divider>{t('products.form.description')}</Divider>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4, mt: 2, mb: 6 }}>
                    <TextField
                        autoFocus
                        multiline
                        rows={2}
                        label="Description en français"
                        value={getLocalizedProduct(product.localizedProducts, Locale.FR).description}
                        onChange={(e) => handleChange(Locale.FR, 'description', e.target.value)}
                        fullWidth
                        sx={{ width: isMobile ? '100%' : '50%' }}
                    />
                    <TextField
                        autoFocus
                        multiline
                        rows={2}
                        label="Description en anglais"
                        value={getLocalizedProduct(product.localizedProducts, Locale.EN).description}
                        onChange={(e) => handleChange(Locale.EN, 'description', e.target.value)}
                        fullWidth
                        sx={{ width: isMobile ? '100%' : '50%' }}
                    />
                </Box>

                <Divider>{t('products.form.info_supplementaire')}</Divider>
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 4, mt: 2, mb: 3 }}>
                    <TextField
                        autoFocus
                        required
                        type="number"
                        label="Prix"
                        value={product.price.toString()}
                        onChange={(e) => setPrice(e.target.value)}
                        fullWidth
                        InputProps={{
                            endAdornment: <InputAdornment position="end">€</InputAdornment>,
                        }}
                        error={!!errors.price}
                        helperText={errors.price}
                        sx={{ width: isMobile ? '100%' : '50%' }}
                    />
                    <Box sx={{ width: isMobile ? '100%' : '50%' }}>
                        <SelectPaginate
                            value={product.shop}
                            onChange={setShop}
                            placeholder="Boutique"
                            refetch={ShopService.getShops}
                            defaultLabel="Aucune"
                        />
                    </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                    <SelectPaginate
                        isMulti
                        value={product.categories}
                        onChange={setCategories}
                        placeholder="Catégories"
                        refetch={CategoryService.getCategories}
                        defaultLabel="Aucune"
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={handleSubmit} variant="contained" size="large" sx={{ width: '30%' }}>
                        {isAddMode ? t('products.form.btn_create') : t('products.form.btn_edit')}
                    </Button>
                </Box>
            </FormControl>
        </Paper>
    );
};

export default ProductForm;
