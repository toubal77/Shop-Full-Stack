import { Box, Paper, Typography } from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ActionButtons, ShopProducts } from '../components';
import { ShopService } from '../services';
import { Shop } from '../types';
import { useAppContext, useToastContext } from '../context';
import { pluralize } from '../utils';
import { useAppDispatch } from '../context/hooks';
import { setToast } from '../context/ToastSlice';

const DAY: Record<number, string> = {
    1: 'Lundi',
    2: 'Mardi',
    3: 'Mercredi',
    4: 'Jeudi',
    5: 'Vendredi',
    6: 'Samedi',
    7: 'Dimanche',
};

const ShopDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setLoading } = useAppContext();
    //const { setToast } = useToastContext();
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
                    dispatch(setToast({ severity: 'success', message: 'La boutique a bien été supprimée' }));
                })
                .catch(() => {
                    dispatch(setToast({ severity: 'error', message: 'Une erreur est survenue lors de la suppression' }));
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
                Cette boutique comporte {shop.nbProducts} {pluralize('produit', shop.nbProducts)}
            </Typography>
            <Typography sx={{ my: 1, textAlign: 'center' }}>
                {shop.inVacations ? 'En congé actuellement' : "N'est pas en congé actuellement"}
            </Typography>
            <Typography sx={{ my: 1, color: 'text.secondary', textAlign: 'center' }}>
                Boutique créée le : {moment(shop.createdAt).format('DD/MM/YYYY')}
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
                    Horaires d&apos;ouverture :
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
                        <Typography sx={{ mb: 1.5 }}>{DAY[openingHour.day]}</Typography>
                        <Typography sx={{ mb: 1.5 }}>
                            {displayHours(openingHour?.openAt)} - {displayHours(openingHour?.closeAt)}
                        </Typography>
                    </Box>
                ))}
            </Box>

            <Typography variant="h4" sx={{ textAlign: 'center', mb: 2, fontSize: { xs: '1.5rem', sm: '1.75rem' } }}>
                Les produits :
            </Typography>
            {id && <ShopProducts shopId={id} />}
        </Paper>
    );
};

export default ShopDetails;
