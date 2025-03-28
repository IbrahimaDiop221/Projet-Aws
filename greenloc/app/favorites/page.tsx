import EmptyState from "@/app/components/EmptyState";
import getCurrentUser from "@/app/actions/getCurrentUser";
import getFavoritesListing from "@/app/actions/getFavoritesListing";
import FavoritesClient from "@/app/favorites/FavoritesClient";

const ListingPage = async () => {
    const listings = await getFavoritesListing();
    const currentUser = await getCurrentUser();

    if(listings.length === 0) {
        return (
            <EmptyState
                title="Aucun favori trouvé"
                subtitle="Il semble que vous n'ayez aucune annonce en favoris."
            />
        )
    }

    return (
        <FavoritesClient
            listings={listings}
            currentUser={currentUser}
        />
    )
}

export default ListingPage;