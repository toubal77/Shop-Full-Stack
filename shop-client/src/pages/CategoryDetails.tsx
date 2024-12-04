import { Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext, useToastContext } from '../context';
import { CategoryService } from '../services';
import { Category } from '../types';
import { ActionButtons } from '../components';
import { useAppDispatch } from '../context/hooks';
import { setToast } from '../context/ToastSlice';

const CategoryDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { setLoading } = useAppContext();
    //const { setToast } = useToastContext();
    const [category, setCategory] = useState<Category | null>(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const getCategory = (categoryId: string) => {
        CategoryService.getCategory(categoryId).then((res) => {
            setCategory(res.data);
        });
    };

    useEffect(() => {
        id && getCategory(id);
    }, [id]);

    const handleDelete = () => {
        setLoading(true);
        id &&
            CategoryService.deleteCategory(id)
                .then(() => {
                    navigate('/category');
                    dispatch(setToast({ severity: 'success', message: 'La catégorie a bien été supprimée' }));
                })
                .catch(() => {
                    dispatch(setToast({ severity: 'error', message: 'Une erreur est survenue lors de la suppression' }));
                })
                .finally(() => {
                    setLoading(false);
                });
    };

    const handleEdit = () => {
        navigate(`/category/edit/${id}`);
    };

    if (!category) return <></>;

    return (
        <Paper
            elevation={1}
            sx={{
                position: 'relative',
                padding: 4,
            }}
        >
            <ActionButtons handleDelete={handleDelete} handleEdit={handleEdit} />

            <Typography variant={isMobile ? "h5":"h3"} sx={{ textAlign: 'center' }}>
                {category.name}
            </Typography>
        </Paper>
    );
};

export default CategoryDetails;
