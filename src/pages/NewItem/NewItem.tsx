import { useState } from "react"
import { useAppSelector } from "../../hooks/hooks"
import { selectUser } from "../../entities/user/userSlice"
import styles from "./NewItem.module.css"
import {
  CATEGORIES,
  categoryToSubcategoriesMapping,
  CONDITION,
  SUBCATEGORIES,
} from "../../utils/constants/Item"
import { prepareCategoryText } from "../../utils/prepareCategoryText"
import { useCreateItemMutation } from "../../entities/items/itemAPI"

function NewItem() {
  const user = useAppSelector(selectUser)

  const [create, meta] = useCreateItemMutation()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    currency: "USD",
    isFree: false,
    isPublished: true,
    category: CATEGORIES.OTHER,
    subcategory: SUBCATEGORIES.OTHER,
    condition: CONDITION.USED,
    images: [],
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    create(formData)
  }

  console.log(meta)

  return (
    <div className={styles.container}>
      <div style={{}}></div>
      <form onSubmit={handleSubmit}>
        <label>
          <div>Title:</div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <label className={styles.description}>
          <div>Description:</div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTextAreaChange}
            required
          />
        </label>
        <div className={styles.price_block}>
          <label>
            <div>Price:</div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
            />
          </label>
          <label>
            <div>Currency:</div>
            <select
              name="currency"
              value={formData.category}
              onChange={handleSelectChange}
            >
              {["usd"].map(cur => (
                <option selected key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </label>
          <div>USD Price:</div>
          <div>{}</div>
        </div>
        <label>
          <div>Category:</div>
          <select
            name="category"
            value={formData.category}
            onChange={handleSelectChange}
          >
            {Object.values(CATEGORIES).map(cat => (
              <option key={cat} value={cat}>
                {prepareCategoryText(cat)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div>Subcategory:</div>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleSelectChange}
          >
            {categoryToSubcategoriesMapping[formData.category].map(subcat => (
              <option key={subcat} value={subcat}>
                {prepareCategoryText(subcat)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <div>Condition:</div>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleSelectChange}
          >
            {Object.values(CONDITION).map(cond => (
              <option key={cond} value={cond}>
                {cond.charAt(0).toUpperCase() + cond.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.item_option_block}>
          <label>
            <div>Free:</div>
            <input
              type="checkbox"
              name="isFree"
              checked={formData.isFree}
              onChange={handleCheckboxChange}
            />
          </label>
          <label>
            <div>Published:</div>
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleCheckboxChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default NewItem
