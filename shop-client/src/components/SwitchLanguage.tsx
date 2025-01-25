import { IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import Locale from '../types/locale';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context';

const SwitchLanguage = () => {
    const { i18n } = useTranslation();
    const { setLocale, locale } = useAppContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (lang: string) => {
        i18n.changeLanguage(lang); 
        setLocale(lang === "FR" ? Locale.FR : Locale.EN);
        handleClose();
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton size="large" onClick={handleMenu} color="inherit">
                <LanguageIcon />
            </IconButton>
            <Menu
                sx={{ mt: '35px' }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={() => handleClick('FR')}>
                    Français
                </MenuItem>
                <MenuItem onClick={() => handleClick('EN')}>
                    Anglais
                </MenuItem>
            </Menu>
        </div>
    );
};

export default SwitchLanguage;
