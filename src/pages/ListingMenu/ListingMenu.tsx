import { Link } from "react-router"
import { useGetParentCategoriesQuery } from "../../entities/category/categoryAPI"
import { type Category } from "../../entities/category/category.type"

function ListingMenu() {
  const { data: categories, isLoading } = useGetParentCategoriesQuery()

  if (isLoading) return <div>Loading...</div>
  if (!categories || categories.length === 0) {
    return <div>No categories available</div>
  }

  const renderCategoryItem = (category: Category) => {
    return (
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to={`/listing?categoryId=${category.id}`}>
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            {category.name}
          </div>
        </Link>
      </div>
    )
  }

  return (
    <div
      style={{
        display: "flex",
        padding: "1rem",
        flexWrap: "wrap",
      }}
    >
      {categories.map(category => renderCategoryItem(category))}
    </div>
  )
}

export default ListingMenu
