import { AppBar, Box, Button, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import SwitchLanguage from './SwitchLanguage';

type Props = {
    children: JSX.Element;
};

const navItems = [
    { label: 'Boutiques', path: '/' },
    { label: 'Produits', path: '/product' },
    { label: 'Catégories', path: '/category' },
];

const Layout = ({ children }: Props) => {
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box sx={{ width: 240, padding: 2, backgroundColor: '#f4f4f4', height: '100%' }}>
            {/* box pour le titre */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                <Typography
                    variant="h6"
                    sx={{ cursor: 'pointer', fontWeight: 'bold', color: '#3f51b5' }}
                    onClick={() => navigate('/')}
                >
                    Gestion de boutiques
                </Typography>
            </Box>

            {/* navigation */}
            <Box sx={{ mb: 2 }}>
                {navItems.map((item) => (
                    <Button
                        key={item.label}
                        sx={{
                            display: 'block', width: '100%', padding: '12px 0', textAlign: 'left', color: '#3f51b5',
                            '&:hover': {
                                backgroundColor: '#e0e0e0',
                            },
                        }}
                        onClick={() => {
                            navigate(item.path);
                            setMobileOpen(false);
                        }}
                    >
                        {item.label}
                    </Button>
                ))}
            </Box>
        </Box>
    );

    return (
        <div>
            <AppBar component="nav">
                <Toolbar>
                    {/* icone de menu pour les petits ecran */}
                    <IconButton
                        color="inherit" aria-label="open drawer" edge="start"
                        onClick={handleDrawerToggle} sx={{ display: { sm: 'none' }, mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* titre */}
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1, cursor: 'pointer',
                            display: { xs: 'none', sm: 'block' },
                        }}
                        onClick={() => navigate('/')}
                    >
                        Gestion de boutiques
                    </Typography>

                    {/* navigation pour les ecrans large */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {navItems.map((item) => (
                            <Button key={item.label} sx={{ color: '#fff' }} onClick={() => navigate(item.path)}>
                                {item.label}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ marginLeft: 'auto' }}>
                        <SwitchLanguage />
                    </Box>
                </Toolbar>
            </AppBar>

            {/* menu Drawer pour les petits ecrans */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240, borderRight: '1px solid #ddd' },
                }}
            >
                {drawer}
            </Drawer>

            <Loader />
            <Box sx={{ mt: 8 }}>{children}</Box>
        </div>
    );
};

export default Layout;
