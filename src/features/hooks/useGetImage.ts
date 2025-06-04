import { useCallback, useEffect, useRef, useState } from "react"
import { useLocation } from "react-router"
import { useGetListingMasonryQuery } from "../../entities/items/itemsAPI"

export const useGetImage = (limit: number = 10) => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const category = searchParams.get("category")
  const isFree = searchParams.get("is_free")

  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)

  const observerRef = useRef<IntersectionObserver | null>(null)

  const { data, isLoading, isFetching, isError, error } =
    useGetListingMasonryQuery({
      offset,
      limit,
      category,
      is_free: isFree,
    })

  useEffect(() => {
    if (data) {
      setItems(prev => [...prev, ...data])
      if (data.length < limit) {
        setHasMore(false)
      }
      //   isReadyRef.current = true
    }
  }, [data, limit])

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(async entries => {
        const entry = entries[0]
        if (entry.isIntersecting && hasMore && !isFetching) {
          setOffset(prev => prev + limit)
        }
      })

      if (node) observerRef.current.observe(node)
    },
    [hasMore, isFetching, limit],
  )

  return { items, lastElementRef, isLoading, isError, error, isFetching }
}
