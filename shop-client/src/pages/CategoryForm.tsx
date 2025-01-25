import { Box, Button, Divider, FormControl, Paper, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext, useToastContext } from '../context';
import { CategoryService } from '../services';
import { MinimalCategory, ObjectPropertyString } from '../types';
import { useTranslation } from 'react-i18next';

const schema = (category: MinimalCategory, t: any) => ({
    name: category.name ? "" : t("categories.form.champ_requis"),
  });

const CategoryForm = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const isAddMode = !id;
    const navigate = useNavigate();
    const { setLoading } = useAppContext();
    const { setToast } = useToastContext();
    const [errors, setErrors] = useState<ObjectPropertyString<MinimalCategory>>();
    const [category, setCategory] = useState<MinimalCategory>({
        name: '',
    });

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablette = useMediaQuery(theme.breakpoints.down('md'));

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
        setLoading(true);
        CategoryService.createCategory(category)
            .then(() => {
                navigate('/category');
                setToast({ severity: 'success', message: 'La catégorie a bien été créée' });
            })
            .catch(() => {
                setToast({ severity: 'error', message: 'Une erreur est survenue lors de la création' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const editCategory = () => {
        setLoading(true);
        CategoryService.editCategory(category)
            .then(() => {
                navigate(`/category/${id}`);
                setToast({ severity: 'success', message: 'La catégorie a bien été modifiée' });
            })
            .catch(() => {
                setToast({ severity: 'error', message: 'Une erreur est survenue lors de la modification' });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const validate = () => {
        const validationErrors = schema(category, t);
        setErrors(validationErrors);
        return Object.values(validationErrors).every((o) => o === "");
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
                {isAddMode ? t('categories.form.ADD_CATEGORIE') : t('categories.form.EDIT_CATEGORIE')}
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
                <Divider>{t('categories.form.info_categorie')}</Divider>
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
                    {t('categories.form.BTN_FORM')}
                </Button>
            </Box>
        </Paper>
    );
};

export default CategoryForm;
