import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    TextFieldProps,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

type FiltersType = {
    inVacations: string;
    createdAfter: Dayjs | null;
    createdBefore: Dayjs | null;
};

const renderTextField = (params: TextFieldProps) => <TextField {...params} />;

const transformFiltersToURL = (filters: FiltersType): string => {
    const transform = {
        ...filters,
        createdAfter: filters.createdAfter?.format('YYYY-MM-DD'),
        createdBefore: filters.createdBefore?.format('YYYY-MM-DD'),
    };

    let url = '';
    for (const [key, value] of Object.entries(transform)) {
        if (value) {
            url += `&${key}=${value}`;
        }
    }

    return url;
};

type Props = {
    setUrlFilters: Dispatch<SetStateAction<string>>;
    setSort: Dispatch<SetStateAction<string>>;
    sort: string;
};

const Filters = ({ setUrlFilters, setSort, sort }: Props) => {
    const defaultFilters: FiltersType = {
        inVacations: '',
        createdAfter: null,
        createdBefore: null,
    };
    const { t } = useTranslation();
    const [open, setOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState<FiltersType>(defaultFilters);

    useEffect(() => {
        if (sort) setFilters(defaultFilters);
    }, [sort]);

    const handleClickButton = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClear = () => {
        setFilters(defaultFilters);
    };

    const handleChange = (key: string, value: string | Dayjs | undefined | null) =>
        setFilters({ ...filters, [key]: value });

    const handleValidate = () => {
        setUrlFilters(transformFiltersToURL(filters));
        setSort('');
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" onClick={handleClickButton}>
                {t('filters.LBL_BTN')}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{t('filters.title')}</DialogTitle>

                <DialogContent>
                    <FormControl fullWidth sx={{ marginTop: 2 }}>
                        <InputLabel id="demo-simple-select-label">{t('filters.vacations')}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={filters.inVacations}
                            label="Congé"
                            onChange={(e) => handleChange('inVacations', e.target.value)}
                        >
                            <MenuItem value="">
                                <em>{t('filters.empty')}</em>
                            </MenuItem>
                            <MenuItem value="true">{t('filters.inVacations')}</MenuItem>
                            <MenuItem value="false">{t('filters.notVacations')}</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Créée après"
                            format="DD/MM/YYYY"
                            value={filters.createdAfter}
                            onChange={(v: Dayjs | null) => handleChange('createdAfter', v)}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>
                </DialogContent>

                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DesktopDatePicker
                            label="Créée avant"
                            format="DD/MM/YYYY"
                            value={filters.createdBefore}
                            onChange={(v: Dayjs | null) => handleChange('createdBefore', v)}
                            slotProps={{ textField: { fullWidth: true } }}
                        />
                    </LocalizationProvider>
                </DialogContent>

                <DialogActions>
                    <Button autoFocus onClick={handleClear}>
                        {t('filters.LBL_BTN_DELETE')}
                    </Button>
                    <Button autoFocus onClick={handleClose}>
                        {t('filters.LBL_BTN_CANCEL')}
                    </Button>
                    <Button onClick={handleValidate}>{t('filters.LBL_BTN_VALID')}</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Filters;
