import EmptyState from "@/app/components/EmptyState";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import TripsClient from "@/app/trips/TripsClient";

const TripsPage = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return (
            <EmptyState
                title="Non autorisé"
                subtitle="Veuillez vous connecter"
            />
        );
    }

    const reservations = await getReservations({
        userId: currentUser.id
    });

    if(reservations.length === 0) {
        return (
            <EmptyState
                title="Aucun voyage trouvé"
                subtitle="Il semble que vous n'ayez réservé aucun voyage"
            />
        )
    }

    return (
        <TripsClient
            reservations={reservations}
            currentUser={currentUser}
        />
    )
}

export default TripsPage;