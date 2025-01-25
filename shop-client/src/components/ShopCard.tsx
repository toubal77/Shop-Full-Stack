import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { Shop } from '../types';
import { pluralize } from '../utils';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Props = {
    shop: Shop;
};

const ShopCard = ({ shop }: Props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Card
            sx={{
                minWidth: isMobile ? '100%' : 175,
                cursor: 'pointer',
                margin: isMobile ? '8px 0' : '8px',
            }}
            onClick={() => navigate(`/shop/${shop.id}`)}
        >
            <CardContent sx={{ padding: isMobile ? '16px' : '24px' }}>
                <Typography
                    variant="h4"
                    color="text.primary"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        fontSize: isMobile ? '1.5rem' : '2rem',
                    }}
                >
                    {shop.name}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                    {shop.nbProducts} {pluralize('produit', shop.nbProducts)}
                </Typography>
                <Typography
                    sx={{
                        my: 1.5,
                        color: 'text.secondary',
                        fontSize: isMobile ? '0.875rem' : '1rem',
                    }}
                >
                    {t('shopCard.createdAt')} {moment(shop.createdAt).format('DD/MM/YYYY')}
                </Typography>
                <Typography sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}>
                    {t('shopCard.vacations')} {shop.inVacations ? 'oui' : 'non'}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ShopCard;
