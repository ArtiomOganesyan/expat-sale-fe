import { useParams } from "react-router"

function Item() {
  const params = useParams()

  return <div>Item: {params.id}</div>
}

export default Item
