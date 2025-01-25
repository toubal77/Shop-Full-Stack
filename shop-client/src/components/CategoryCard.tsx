import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { useMediaQuery, useTheme } from '@mui/material';

type Props = {
    category: Category;
};

const CategoryCard = ({ category }: Props) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Card
            sx={{
                cursor: 'pointer',
                margin: isMobile ? '8px 0' : '8px',
                width: '100%',
            }}
            onClick={() => navigate(`/category/${category.id}`)}
        >
            <CardContent sx={{ padding: isMobile ? '16px' : '24px' }}>
                <Typography
                    variant="h5"
                    color="text.primary"
                    sx={{
                        textAlign: 'center',
                        fontSize: isMobile ? '1.25rem' : '1.5rem',
                    }}
                >
                    {category.name}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default CategoryCard;
