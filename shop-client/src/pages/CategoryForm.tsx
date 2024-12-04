import { Box, Button, Divider, FormControl, Paper, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext, useToastContext } from '../context';
import { CategoryService } from '../services';
import { MinimalCategory, ObjectPropertyString } from '../types';
import { useAppDispatch } from '../context/hooks';
import { setToast } from '../context/ToastSlice';

const schema = (category: MinimalCategory) => ({
    name: category.name ? '' : 'Ce champ est requis',
});

const CategoryForm = () => {
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setLoading } = useAppContext();
    //const { setToast } = useToastContext();
    const [errors, setErrors] = useState<ObjectPropertyString<MinimalCategory>>();
    const [category, setCategory] = useState<MinimalCategory>({
        name: '',
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablette = useMediaQuery(theme.breakpoints.down('md'));

    const handleCategoryAction = (action: Promise<any>, successMessage: string, redirectPath: string) => {
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

    const getCategory = (categoryId: string) => {
        setLoading(true);
        CategoryService.getCategory(categoryId)
            .then((res) => {
                setCategory({
                    ...res.data,
                    id: id,
                });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        !isAddMode && id && getCategory(id);
    }, [isAddMode]);

    const createCategory = () => {
        handleCategoryAction(
            CategoryService.createCategory(category),
            'La catégorie a bien été créée',
            `/category`
        );
    };

    const editCategory = () => {
        handleCategoryAction(
            CategoryService.editCategory(category),
            'La catégorie a bien été modifiée',
            `/category/${id}`
        );
    };

    const validate = () => {
        setErrors(schema(category));
        return Object.values(schema(category)).every((o) => o == '');
    };

    const handleSubmit = () => {
        if (!validate()) return;
        if (isAddMode) {
            createCategory();
        } else {
            editCategory();
        }
    };

    return (
        <Paper elevation={1} sx={{ padding: 4 }}>
            <Typography variant={isMobile ? "h4": isTablette ? "h3": "h2"} sx={{ marginBottom: 3, textAlign: 'center' }}>
                {isAddMode ? 'Ajouter une catégorie' : 'Modifier la catégorie'}
            </Typography>

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
                <Divider>Informations de la catégorie</Divider>
                <TextField
                    autoFocus
                    required
                    label="Nom"
                    value={category.name}
                    onChange={(e) => setCategory({ ...category, name: e.target.value })}
                    error={!!errors?.name}
                    helperText={errors?.name}
                    sx={{ my: 2, width: '85%', ml: 'auto', mr: 'auto' }}
                />
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" onClick={handleSubmit}>
                    Valider
                </Button>
            </Box>
        </Paper>
    );
};

export default CategoryForm;
