import { useLocation } from "react-router"

import styles from "./ListingMasonry.module.css"
import { useGetListingMasonryQuery } from "../../entities/items/itemsAPI"
import { ListingCard } from "../../shared/ListingCard/ListingCardMui"
import Listing from "../../pages/Listing/Listing"

function ListingMasonry() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const category = searchParams.get("category")
  const isFree = searchParams.get("is_free")

  function getRandomEvenOrOdd(isEven = true, min = 0, max = 100) {
    let num = Math.floor(Math.random() * ((max - min) / 2 + 1)) * 2 + min
    return isEven ? num : num + 1
  }

  const { data, isError, error, isLoading, isFetching } =
    useGetListingMasonryQuery({ limit: 10, skip: 0, category, is_free: isFree })

  if (isLoading) return <div>Loading...</div>
  if (isError) {
    console.error(error)

    return (
      <div>
        Error: {(error as any)?.message || (error as any)?.error || "error"}
      </div>
    )
  }

  return (
    <div className={styles.grid_container}>
      {data?.map((listing: any, index: number) => {
        if (getRandomEvenOrOdd() % 3) {
          return (
            <ListingCard
              className={`${styles.item} ${styles.large}`}
              size="large"
              key={listing.id}
              {...listing}
            />
          )
        }

        return (
          <ListingCard
            className={`${styles.item}`}
            size="small"
            key={listing.id}
            {...listing}
          />
        )
      })}
    </div>
  )
}

export default ListingMasonry
