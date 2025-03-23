import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import EmptyState from "@/app/components/EmptyState";
import ReservationsClient from "@/app/reservations/ReservationsClient";

const ReservationsPage = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return (
            <EmptyState
                title="Non autorisé"
                subtitle="Veuillez vous connecter"
            />
        )
    }

    const reservations = await getReservations({
        authorId: currentUser.id
    });

    if(reservations.length === 0) {
        return (
            <EmptyState
                title="Aucune réservation trouvée"
                subtitle="Il semble que vous n'ayez aucune réservation sur vos propriétés"
            />
        )
    }

    return (
        <ReservationsClient
            reservations={reservations}
            currentUser={currentUser}
        />
    )
}
export default ReservationsPage;