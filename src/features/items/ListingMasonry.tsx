import styles from "./ListingMasonry.module.css"
import { ListingCard } from "../../shared/ListingCard/ListingCardMui"
import { useGetImage } from "../hooks/useGetImage"
import { Box, CircularProgress } from "@mui/material"

function ListingMasonry() {
  const { items, isLoading, isError, error, lastElementRef, isFetching } =
    useGetImage(15)

  if (isLoading)
    return (
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
        height={"100vh"}
      >
        <CircularProgress size={40} />
      </Box>
    )
  if (isError) {
    console.error(error)

    return (
      <div>
        Error: {(error as any)?.message || (error as any)?.error || "error"}
      </div>
    )
  }

  function getRandomEvenOrOdd(isEven = true, min = 0, max = 100) {
    let num = Math.floor(Math.random() * ((max - min) / 2 + 1)) * 2 + min
    return isEven ? num : num + 1
  }

  return (
    <div className={styles.grid_container}>
      {items?.map((item: any, index: number) => {
        const isLast = index === items.length - 1

        return (
          <ListingCard
            className={`${styles.item}`}
            key={item.id}
            {...item}
            ref={isLast ? lastElementRef : null}
          />
        )
      })}
    </div>
  )
}

export default ListingMasonry
