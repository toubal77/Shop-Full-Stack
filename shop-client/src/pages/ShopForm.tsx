import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    TextField,
    TextFieldProps,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShopService } from '../services';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { MinimalShop, ObjectPropertyString } from '../types';
import { useAppContext } from '../context';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../context/hooks';
import { setToast } from '../context/ToastSlice';
import { handleAction } from '../utils/actionHandler';
const schema = (shop: MinimalShop, t: any) => ({
    name: shop.name ? '' : t('shop.form.champ_requis'),
});

const ShopForm = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setLoading } = useAppContext();
    const [errors, setErrors] = useState<ObjectPropertyString<MinimalShop>>();
    const renderTimeField = (params: TextFieldProps) => <TextField {...params} fullWidth />;

    const [shop, setShop] = useState<MinimalShop>({
        name: '',
        inVacations: false,
        openingHours: [],
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const getShop = (shopId: string) => {
        setLoading(true);
        ShopService.getShop(shopId)
            .then((res) => {
                setShop({
                    ...res.data,
                    id: id,
                });
            })
            .finally(() => setLoading(false));
    };

    const createShop = () => {
        handleAction(ShopService.createShop(shop), 'La boutique a bien été créée', '/', dispatch, navigate, setLoading);
    };

    const editShop = () => {
        handleAction(
            ShopService.createShop(shop),
            'La boutique a bien été modifié',
            `/shop/${id}`,
            dispatch,
            navigate,
            setLoading,
        );
    };

    useEffect(() => {
        !isAddMode && id && getShop(id);
    }, [isAddMode]);

    const hasConflict = (openingHours: any[]) => {
        const groupedByDay = openingHours.reduce((acc: any, curr: any) => {
            if (!acc[curr.day]) acc[curr.day] = [];
            acc[curr.day].push(curr);
            return acc;
        }, {});

        for (const day in groupedByDay) {
            const dayHours = groupedByDay[day];
            for (let i = 0; i < dayHours.length; i++) {
                for (let j = i + 1; j < dayHours.length; j++) {
                    const startA = dayHours[i].openAt;
                    const endA = dayHours[i].closeAt;
                    const startB = dayHours[j].openAt;
                    const endB = dayHours[j].closeAt;

                    if (
                        startA < endB &&
                        endA > startB // Overlapping condition
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const handleChange = (index: number, key: string, value: number | string | undefined) => {
        const openingHours = [...shop.openingHours];
        const openingHour = { ...openingHours[index], [key]: value };
        openingHours[index] = openingHour;

        if (key === 'openAt' || key === 'closeAt') {
            const openTime = openingHour.openAt || openingHours[index].openAt;
            const closeTime = openingHour.closeAt || openingHours[index].closeAt;

            if (openTime && closeTime && openTime >= closeTime) {
                setToast({
                    severity: 'error',
                    message: "L'heure de fermeture ne peut pas être avant l'heure d'ouverture",
                });
                return;
            }
        }

        if (hasConflict(openingHours)) {
            setToast({ severity: 'error', message: 'Les horaires se chevauchent pour un même jour' });
            return;
        }

        setShop({ ...shop, openingHours });
    };

    const handleClickAddHours = () => {
        setShop({ ...shop, openingHours: [...shop.openingHours, { day: 1, openAt: '09:00:00', closeAt: '18:00:00' }] });
    };

    const handleClickClearHours = (index: number) => {
        setShop({ ...shop, openingHours: shop.openingHours.filter((o, i) => i !== index) });
    };

    const validate = () => {
        if (hasConflict(shop.openingHours)) {
            setToast({ severity: 'error', message: 'Les horaires se chevauchent pour un même jour' });
            return false;
        }
        setErrors(schema(shop, t));
        return Object.values(schema(shop, t)).every((o) => o == '');
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (isAddMode) {
            createShop();
        } else {
            editShop();
        }
    };

    return (
        <Paper elevation={1} sx={{ padding: 4 }}>
            <Typography
                variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'}
                sx={{ marginBottom: 3, textAlign: 'center' }}
            >
                {isAddMode ? t('shop.form.LBL_ADD_SHOP') : t('shop.form.LBL_EDIT_SHOP')}
            </Typography>

            <Box sx={{ display: 'block', ml: 'auto', mr: 'auto', width: isMobile ? '100%' : '80%', mb: 3 }}>
                <Divider>{t('shop.form.info_shop')}</Divider>
                <FormControl
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        ml: 'auto',
                        mr: 'auto',
                        width: '70%',
                        mb: 2,
                    }}
                >
                    <TextField
                        autoFocus
                        required
                        label="Nom"
                        value={shop.name}
                        onChange={(e) => setShop({ ...shop, name: e.target.value })}
                        fullWidth
                        error={!!errors?.name}
                        helperText={errors?.name}
                        sx={{ my: 2, width: '85%', ml: 'auto', mr: 'auto' }}
                    />
                    <FormControlLabel
                        value="start"
                        control={
                            <Switch
                                checked={shop.inVacations}
                                onChange={(e) => setShop({ ...shop, inVacations: e.target.checked })}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="En congé"
                        sx={{ marginBottom: 2 }}
                    />
                </FormControl>

                {/* OpeningHours */}
                <Divider sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    {t('shop.form.heures_ouvertures')}
                </Divider>
                <Box sx={{ mt: 1, mb: 3 }}>
                    <Fab size="small" color="primary" aria-label="add">
                        <AddIcon onClick={handleClickAddHours} />
                    </Fab>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 3 }}>
                    {shop.openingHours.map((openingHour, index) => (
                        <Paper elevation={2} key={index} sx={{ position: 'relative' }}>
                            <Box
                                sx={{
                                    px: 2,
                                    pb: 1,
                                    pt: 7,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                    alignItems: 'center',
                                }}
                            >
                                <FormControl sx={{ marginBottom: 2, width: '100%' }}>
                                    <InputLabel id="demo-simple-select-label">Jour</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        value={openingHour.day}
                                        label="Jour"
                                        onChange={(e) => handleChange(index, 'day', e.target.value)}
                                        fullWidth
                                    >
                                        <MenuItem value={1}>{t('openingDays.1')}</MenuItem>
                                        <MenuItem value={2}>{t('openingDays.2')}</MenuItem>
                                        <MenuItem value={3}>{t('openingDays.3')}</MenuItem>
                                        <MenuItem value={4}>{t('openingDays.4')}</MenuItem>
                                        <MenuItem value={5}>{t('openingDays.5')}</MenuItem>
                                        <MenuItem value={6}>{t('openingDays.6')}</MenuItem>
                                        <MenuItem value={7}>{t('openingDays.7')}</MenuItem>
                                    </Select>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Ouvre à"
                                        ampm={false}
                                        value={dayjs(`2014-08-18T${openingHour.openAt}`)}
                                        onChange={(v: Dayjs | null) =>
                                            handleChange(index, 'openAt', v?.format('HH:mm:ss'))
                                        }
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Ferme à"
                                        ampm={false}
                                        value={dayjs(`2014-08-18T${openingHour.closeAt}`)}
                                        onChange={(v: Dayjs | null) =>
                                            handleChange(index, 'closeAt', v?.format('HH:mm:ss'))
                                        }
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                                <ClearIcon
                                    sx={{
                                        position: 'absolute',
                                        top: 3,
                                        right: 2,
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleClickClearHours(index)}
                                />
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ padding: 1, width: isMobile ? '100%' : 'auto' }}
                >
                    {isAddMode ? t('shop.form.ADD_SHOP') : t('shop.form.EDIT_SHOP')}
                </Button>
            </Box>
        </Paper>
    );
};

export default ShopForm;
