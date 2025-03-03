import getCurrentUser from "./actions/getCurrentUser";
import getListings from "./actions/getListings";

import ClientOnly from "./components/ClientOnly";
import Container from "./components/Container";
import EmptyState from "./components/EmptyState";
import ListingsCard from "./components/listings/listingCard";

export default async function Home() {
  const Listings = await getListings();
  const currentUser = await getCurrentUser();

  if (listings.length == 0) {
    return(
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
    )
  }
  return (
    <ClientOnly>
      <Container>
        <div className="
        PT-24
        grid
        grid-cols-1
        sm:grid-cols-2
        md:grid-cols-3
        ld:grid-cold-4
        xl:grid-cols-5
        2xl:grid-cols-6
        gap-8
        ">
          {Listings.map((listing: any) => {
            return (
              <ListingsCard
              key={listing.id}
              data={listing}
              />
            )
          })}
          </div>
      </Container>
    </ClientOnly>
  );
}
