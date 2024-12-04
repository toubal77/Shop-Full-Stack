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
import { Dayjs } from 'dayjs';
import { MinimalShop, ObjectPropertyString } from '../types';
import { useAppContext, useToastContext } from '../context';
import { useAppDispatch } from '../context/hooks';
import { setToast } from '../context/ToastSlice';
const schema = (shop: MinimalShop) => ({
    name: shop.name ? '' : 'Ce champ est requis',
});

const ShopForm = () => {
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setLoading } = useAppContext();
    //const { setToast } = useToastContext();
    const [errors, setErrors] = useState<ObjectPropertyString<MinimalShop>>();
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

    const handleShopAction = (action: Promise<any>, successMessage: string, redirectPath: string) => {
        setLoading(true);
        action
            .then(() => {
                navigate(redirectPath);
                dispatch(setToast({ severity: 'success', message: successMessage }));
            })
            .catch(() => {
                dispatch(setToast({ severity: 'error', message: 'Une erreur est survenue lors de l\'opération' }));
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const createShop = () => {
        handleShopAction(
            ShopService.createShop(shop),
            'La boutique a bien été créée',
            `/`
        );
    };

    const editShop = () => {
        handleShopAction(
            ShopService.createShop(shop),
            'La boutique a bien été modifié',
           `/shop/${id}`
        );
    };

    useEffect(() => {
        !isAddMode && id && getShop(id);
    }, [isAddMode]);

    const handleChange = (index: number, key: string, value: number | string | undefined) => {
        const openingHours = shop.openingHours;
        const openingHour = {
            ...openingHours[index],
            [key]: value,
        };
        openingHours[index] = openingHour;
        setShop({ ...shop, openingHours });
    };

    const handleClickAddHours = () => {
        setShop({ ...shop, openingHours: [...shop.openingHours, { day: 1, openAt: '09:00:00', closeAt: '18:00:00' }] });
    };

    const handleClickClearHours = (index: number) => {
        setShop({ ...shop, openingHours: shop.openingHours.filter((o, i) => i !== index) });
    };

    const validate = () => {
        setErrors(schema(shop));
        return Object.values(schema(shop)).every((o) => o == '');
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
            <Typography variant={isMobile ? 'h4' : isTablet ? 'h3' : 'h2'} sx={{ marginBottom: 3, textAlign: 'center' }}>
                {isAddMode ? 'Ajouter une boutique' : 'Modifier la boutique'}
            </Typography>

            <Box sx={{ display: 'block', ml: 'auto', mr: 'auto', width: isMobile ? '100%' : '80%', mb: 3 }}>
                <Divider>Informations de la boutique</Divider>
                <FormControl sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    ml: 'auto',
                    mr: 'auto',
                    width: '70%',
                    mb: 2, }}>
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
                <Divider  sx={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
                    Horaires d&apos;ouverture de la boutique</Divider>
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
                                        <MenuItem value={1}>Lundi</MenuItem>
                                        <MenuItem value={2}>Mardi</MenuItem>
                                        <MenuItem value={3}>Mercredi</MenuItem>
                                        <MenuItem value={4}>Jeudi</MenuItem>
                                        <MenuItem value={5}>Vendredi</MenuItem>
                                        <MenuItem value={6}>Samedi</MenuItem>
                                        <MenuItem value={7}>Dimanche</MenuItem>
                                    </Select>
                                </FormControl>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Ouvre à"
                                        ampm={false}
                                        value={`2014-08-18T${openingHour.openAt}`}
                                        onChange={(v: Dayjs | null) =>
                                            handleChange(index, 'openAt', v?.format('HH:mm:ss'))
                                        }
                                        renderInput={(params) => <TextField {...params} fullWidth />}
                                    />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <TimePicker
                                        label="Ferme à"
                                        ampm={false}
                                        value={`2014-08-18T${openingHour.closeAt}`}
                                        onChange={(v: Dayjs | null) =>
                                            handleChange(index, 'closeAt', v?.format('HH:mm:ss'))
                                        }
                                        renderInput={(params) => <TextField {...params} fullWidth />}
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
                <Button variant="contained" onClick={handleSubmit}
                    sx={{ padding: 1, width: isMobile ? '100%' : 'auto' }}
                >
                    {isAddMode ? 'Ajouter' : 'Modifier'}
                </Button>
            </Box>
        </Paper>
    );
};

export default ShopForm;
