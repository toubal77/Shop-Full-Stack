import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import SwitchLanguage from './SwitchLanguage';
import { useTranslation } from 'react-i18next';
import { useTheme, useMediaQuery } from '@mui/material';

type Props = {
    children: JSX.Element;
};

const navItems = [
    { label: 'boutiques', path: '/' },
    { label: 'produits', path: '/product' },
    { label: 'catégories', path: '/category' },
];

const Layout = ({ children }: Props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box
            sx={{
                width: 240,
                padding: 2,
                backgroundColor: '#f4f4f4',
                height: '100%',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 4,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        color: '#3f51b5',
                        fontSize: isMobile ? '1.1rem' : '1.25rem',
                    }}
                    onClick={() => {
                        navigate('/');
                        setMobileOpen(false);
                    }}
                >
                    {t('header.title')}
                </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
                {navItems.map((item) => (
                    <Button
                        key={item.label}
                        sx={{
                            display: 'block',
                            width: '100%',
                            padding: '12px 0',
                            textAlign: 'left',
                            color: '#3f51b5',
                            fontSize: isMobile ? '0.9rem' : '1rem',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        }}
                        onClick={() => {
                            navigate(item.path);
                            setMobileOpen(false);
                        }}
                    >
                        {t(`header.${item.label.toLowerCase()}`)}
                    </Button>
                ))}
            </Box>
        </Box>
    );

    return (
        <div>
            <AppBar component="nav">
                <Toolbar
                    sx={{
                        padding: isMobile ? '0 8px' : '0 24px',
                        minHeight: { xs: '56px', sm: '64px' },
                    }}
                >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { sm: 'none' }, mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                            cursor: 'pointer',
                            display: { xs: 'none', sm: 'block' },
                            fontSize: isMobile ? '1.1rem' : '1.25rem',
                        }}
                        onClick={() => navigate('/')}
                    >
                        {t('header.title')}
                    </Typography>

                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                sx={{
                                    color: '#fff',
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                    padding: isMobile ? '6px 8px' : '6px 16px',
                                }}
                                onClick={() => navigate(item.path)}
                            >
                                {t(`header.${item.label.toLowerCase()}`)}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <SwitchLanguage />
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 240,
                        borderRight: '1px solid #ddd',
                    },
                }}
            >
                {drawer}
            </Drawer>

            <Loader />
            <Box
                sx={{
                    mt: { xs: 7, sm: 8 },
                    padding: { xs: 1, sm: 2, md: 3 },
                }}
            >
                {children}
            </Box>
        </div>
    );
};

export default Layout;
