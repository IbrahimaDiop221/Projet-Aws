// Importation de Zustand pour la gestion de l'état
import { create } from 'zustand';

// Création du store pour la gestion de l'état de la modale de connexion
const useLoginModal = create((set) => ({
    // État initial : la modale est fermée
    isOpen: false,

    // Fonction pour ouvrir la modale
    openModal: () => set(() => ({ isOpen: true })),

    // Fonction pour fermer la modale
    closeModal: () => set(() => ({ isOpen: false }))
}));

export default useLoginModal;
