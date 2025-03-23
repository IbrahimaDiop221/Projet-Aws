import EmptyState from "@/app/components/EmptyState";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getListings from "@/app/actions/getListings";
import PropertiesClient from "@/app/properties/PropertiesClient";

const PropertiesPage = async () => {
    const currentUser = await getCurrentUser();

    if(!currentUser) {
        return (
            <EmptyState
                title="Non autorisé"
                subtitle="Veuillez vous connecter"
            />
        );
    }

    const listings = await getListings({
        userId: currentUser.id
    });

    if(listings.length === 0) {
        return (
            <EmptyState
                title="Aucune propriété trouvée"
                subtitle="Il semble que vous n'ayez aucune propriété"
            />
        )
    }

    return (
        <PropertiesClient
            listings={listings}
            currentUser={currentUser}
        />
    )
}

export default PropertiesPage;