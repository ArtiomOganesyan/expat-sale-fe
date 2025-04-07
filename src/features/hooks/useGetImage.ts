import { useState } from "react"
import { useLocation } from "react-router"
import { useGetListingMasonryQuery } from "../../entities/items/itemsAPI"

export const useGetImage = <T>(limit: number) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const category = searchParams.get("category")
  const isFree = searchParams.get("is_free")

  const { data, isError, error, isLoading, isFetching } =
    useGetListingMasonryQuery({ limit: 10, skip: 0, category, is_free: isFree })

  const [image, setImage] = useState<T[]>([])
  const [offset, setOffset] = useState<number>(0)
}
