import { Box, Paper, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionButtons, ShopProducts } from '../components';
import { ShopService } from '../services';
import { Shop } from '../types';
import { useAppContext, useToastContext } from '../context';
import { pluralize } from '../utils';
import { useTranslation } from 'react-i18next';

const ShopDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const { setToast } = useToastContext();
    const [shop, setShop] = useState<Shop | null>(null);

    const getShop = (shopId: string) => {
        ShopService.getShop(shopId).then((res) => {
            // sort openingHours
            res.data.openingHours = res.data.openingHours.sort((a, b) => a.day - b.day);
            setShop(res.data);
        });
    };

    useEffect(() => {
        id && getShop(id);
    }, [id]);

    const displayHours = (hours: string): string => {
        return moment(hours, 'HH:mm').format('HH:mm');
    };

    const handleDelete = () => {
        setLoading(true);
        id &&
            ShopService.deleteShop(id)
                .then(() => {
                    navigate('/');
                    setToast({ severity: 'success', message: 'La boutique a bien été supprimée' });
                })
                .catch(() => {
                    setToast({ severity: 'error', message: 'Une erreur est survenue lors de la suppresion' });
                })
                .finally(() => {
                    setLoading(false);
                });
    };

    const handleEdit = () => {
        navigate(`/shop/edit/${id}`);
    };

    if (!shop) return <></>;

    return (
        <Paper
            elevation={1}
            sx={{
                position: 'relative',
                padding: 4,display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%',
            }}
        >
            <ActionButtons handleDelete={handleDelete} handleEdit={handleEdit} />

            <Typography variant="h3" sx={{ textAlign: 'center', marginBottom: 3, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                {shop.name}
            </Typography>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
            {t('shop_details.details.nbrProducts')} {shop.nbProducts} {pluralize('produit', shop.nbProducts)}
            </Typography>
            <Typography sx={{ my: 1, textAlign: 'center' }}>
                {shop.inVacations ? t('shop_details.details.inVacations') : t('shop_details.details.notVacations')}
            </Typography>
            <Typography sx={{ my: 1, color: 'text.secondary', textAlign: 'center' }}>
            {t('shop_details.details.createdAt')} {moment(shop.createdAt).format('DD/MM/YYYY')}
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    my: 4, width: '100%',
                }}
            >
                <Typography variant="h4" sx={{ mb: 2, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                {t('shop_details.details.heure_ouverture')}
                </Typography>
                {shop.openingHours.map((openingHour) => (
                    <Box
                        key={openingHour.id}
                        sx={{
                            width: { xs: '100%', sm: '200px' },
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between', mb: 2,
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        <Typography sx={{ mb: 1.5 }}>{t(`openingDays.${openingHour.day}`)}</Typography>
                        <Typography sx={{ mb: 1.5 }}>
                            {displayHours(openingHour?.openAt)} - {displayHours(openingHour?.closeAt)}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
            {t('shop_details.details.products')}
            </Typography>
            {id && <ShopProducts shopId={id} />}
        </Paper>
    );
};

export default ShopDetails;
