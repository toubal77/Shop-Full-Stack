import { AppDispatch } from '../context/store';
import { setToast } from '../context/ToastSlice';
import { NavigateFunction } from 'react-router-dom';

/**
 * Gère les actions asynchrones avec gestion des messages de succès et d'erreur.
 *
 * @param action - l'action à exécuter
 * @param successMessage - Le message de succès à afficher en cas de réussite
 * @param redirectPath - Le chemin vers lequel rediriger en cas de succès
 * @param dispatch - La fonction dispatch de Redux
 * @param navigate - La fonction navigate de React Router
 * @param setLoading - Fonction pour gérer l'état de chargement (optionnelle)
 */
export const handleAction = (
    action: Promise<any>,
    successMessage: string,
    redirectPath: string,
    dispatch: AppDispatch,
    navigate: NavigateFunction,
    setLoading?: (loading: boolean) => void,
) => {
    if (setLoading) setLoading(true);
    action
        .then(() => {
            navigate(redirectPath);
            dispatch(setToast({ severity: 'success', message: successMessage }));
        })
        .catch((error) => {
            const errorMessage = error?.response?.data?.message || "Une erreur est survenue lors de l'opération";

            dispatch(setToast({ severity: 'error', message: errorMessage }));
        })
        .finally(() => {
            if (setLoading) setLoading(false);
        });
};
