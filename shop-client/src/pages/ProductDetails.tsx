import { Paper, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ActionButtons } from '../components';
import { useAppContext, useToastContext } from '../context';
import { ProductService } from '../services';
import { FormattedProduct, Product } from '../types';
import { formatterLocalizedProduct, priceFormatter } from '../utils';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../context/hooks';
import { setToast } from '../context/ToastSlice';
import { handleAction } from '../utils/actionHandler';

const ProductDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setLoading, locale } = useAppContext();
    const [product, setProduct] = useState<Product | null>(null);
    const [formattedProduct, setFormattedProduct] = useState<FormattedProduct | null>();

    const getProduct = (productId: string) => {
        ProductService.getProduct(productId).then((res) => {
            setProduct(res.data);
        });
    };

    useEffect(() => {
        id && getProduct(id);
    }, [id]);

    useEffect(() => {
        product && setFormattedProduct(formatterLocalizedProduct(product, locale));
    }, [locale, product]);

    const handleDelete = () => {
        if (!id) return; 
        handleAction(
            ProductService.deleteProduct(id),
            'Le produit a bien été supprimé',
            '/',
            dispatch,
            navigate,
            setLoading
        );
    };

    const handleEdit = () => {
        navigate(`/product/edit/${id}`);
    };

    if (!formattedProduct) return <></>;

    return (
        <Paper
            elevation={1}
            sx={{
                position: 'relative', padding: { xs: 2, sm: 4 }, maxWidth: '100%', margin: 'auto',
                '@media (max-width: 600px)': {
                    padding: 2, 
                },
            }}
        >
            <ActionButtons handleDelete={handleDelete} handleEdit={handleEdit} />

            <Typography
                variant="h3"
                sx={{
                    textAlign: 'center', marginBottom: 3,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                }}
            >
                {formattedProduct.name}
            </Typography>
            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                {t('product_details.details.prix')} : {priceFormatter(formattedProduct.price)}
            </Typography>
            {formattedProduct.description && (
                <Typography sx={{ mt: 1.5, fontSize: { xs: '0.9rem', sm: '1rem' } }} color="text.secondary">
                    {t('product_details.details.description')} : {formattedProduct.description}
                </Typography>
            )}
            <Typography sx={{ mt: 1.5, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                {t('product_details.details.boutique')} :{' '}
                {formattedProduct.shop?.name ? (
                    <Link to={`/shop/${formattedProduct.shop?.id}`} style={{ color: '#607d8b' }}>
                        {formattedProduct.shop?.name}
                    </Link>
                ) : (
                    t('product_details.details.boutique_empty')
                )}
            </Typography>
            <Typography sx={{ mt: 1.5, fontStyle: 'italic', fontSize: { xs: '0.9rem', sm: '1rem' } }}>
            {t('product_details.details.categorie')} : {''}
                {formattedProduct.categories.length === 0
                    ? t('product_details.details.empty')
                    : formattedProduct.categories.map((cat, index) => (
                          <Fragment key={cat.id}>
                              <Link to={`/category/${cat.id}`} style={{ color: '#607d8b' }}>
                                  {cat.name}
                              </Link>
                              <span>{index === formattedProduct.categories.length - 1 ? '' : ', '}</span>
                          </Fragment>
                      ))}
            </Typography>
        </Paper>
    );
};

export default ProductDetails;
