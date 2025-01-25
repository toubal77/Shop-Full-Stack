import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';
import { FormattedProduct, Product } from '../types';
import { formatterLocalizedProduct, priceFormatter } from '../utils';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
    product: Product;
    displayShop?: boolean;
};

const ProductCard = ({ product, displayShop = false }: Props) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { locale } = useAppContext();
    const [formattedProduct, setFormattedProduct] = useState<FormattedProduct>(
        formatterLocalizedProduct(product, locale),
    );

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    useEffect(() => setFormattedProduct(formatterLocalizedProduct(product, locale)), [locale]);

    return (
        <Card
            sx={{
                minWidth: isMobile ? '100%' : 175,
                height: displayShop ? { xs: 'auto', sm: 280 } : { xs: 'auto', sm: 240 },
                cursor: 'pointer',
                margin: isMobile ? '8px 0' : '8px',
            }}
            onClick={() => navigate(`/product/${formattedProduct.id}`)}
        >
            <CardContent sx={{ padding: isMobile ? '16px' : '24px' }}>
                <Typography
                    variant="h4"
                    color="text.primary"
                    gutterBottom
                    sx={{ fontSize: isMobile ? '1.5rem' : '2rem' }}
                >
                    {formattedProduct.name}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                    {t('productCard.price')} {priceFormatter(formattedProduct.price)}
                </Typography>
                {formattedProduct.description && (
                    <Typography
                        sx={{
                            mt: 1.5,
                            maxHeight: 50,
                            overflow: 'hidden',
                            color: 'text.secondary',
                            fontSize: isMobile ? '0.875rem' : '1rem',
                        }}
                    >
                        {formattedProduct.description}
                    </Typography>
                )}
                {displayShop && (
                    <Typography
                        sx={{
                            mt: 1.5,
                            fontSize: isMobile ? '0.875rem' : '1rem',
                        }}
                    >
                        {t('productCard.shop')} {formattedProduct.shop?.name ?? 'Aucune'}
                    </Typography>
                )}
                <Typography
                    sx={{
                        mt: 1.5,
                        fontStyle: 'italic',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                    }}
                >
                    {t('productCard.category')} {''}
                    {formattedProduct.categories.length === 0
                        ? t('productCard.empty')
                        : formattedProduct.categories.map((cat, index) => (
                              <span key={cat.id}>
                                  {cat.name}
                                  {index === formattedProduct.categories.length - 1 ? '' : ', '}
                              </span>
                          ))}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ProductCard;
