import { useMemo, useState } from "react"
import {
  CATEGORIES,
  categoryToSubcategoriesMapping,
  CONDITION,
  SUBCATEGORIES,
} from "../../utils/constants/Item"
import {
  useAddImageToItemMutation,
  useCreateItemMutation,
} from "../../entities/items/itemAPI"

import styles from "./NewItem.module.css"
import { prepareCategoryText } from "../../utils/prepareCategoryText"
import FormInput from "../../shared/FormInput/FormInput"
import FormSelect from "../../shared/FormSelect/FormSelect"
import FormCheckBox from "../../shared/FormCheck/FormCheckBox"
import { formChangeHandler } from "./utils/formChangeHandler"
import { useAppSelector } from "../../hooks/hooks"
import { getRates } from "../../entities/currency/currencySlice"
import FormFiles from "../../shared/FormFiles/FormFiles"
import Button from "@mui/material/Button"

function NewItemForm() {
  const [create, createMeta] = useCreateItemMutation()
  const [addImage, addImageMeta] = useAddImageToItemMutation()
  const isLoading = createMeta.isLoading || addImageMeta.isLoading
  const currencyRates = useAppSelector(getRates)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    currency: "EUR",
    isFree: false,
    isPublished: true,
    category: CATEGORIES.OTHER,
    subcategory: SUBCATEGORIES.OTHER,
    condition: CONDITION.USED,
  })

  const [files, setFiles] = useState<File[]>([])

  const { handleInputChange, handleSelectChange, handleCheckboxChange } =
    formChangeHandler(setFormData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const priceInEUR = getEURPrice(formData.price, formData.currency)
    const result = await create({
      ...formData,
      price: +priceInEUR,
      currency: "EUR",
    })

    if (result.data) {
      const itemId = result.data.id
      const addFilesResult = await Promise.allSettled(
        files.map(file => addImage({ itemId, file })),
      )
    }
  }

  const getEURPrice = (price: number, currency: string) => {
    const rate = currencyRates.find(r => r[0] === currency)
    if (rate) {
      return (price / rate[1]).toFixed(2)
    }
    return 0
  }

  const subcategories = useMemo(() => {
    const cat = Object.entries(categoryToSubcategoriesMapping)
    const sub_cat: any = []
    cat.forEach(([category, value]) => {
      const subcategories = value.map(subcategory => ({
        category: category,
        subcategory: subcategory,
        groupBy: prepareCategoryText(category),
        label: prepareCategoryText(subcategory),
      }))
      sub_cat.push(...subcategories)
    })
    return sub_cat
  }, [])

  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit}>
        <FormInput
          label={"Title"}
          type={"text"}
          id={"title"}
          name={"title"}
          placeholder={"What do you want to sell?"}
          onChange={handleInputChange}
        />

        <FormInput
          label={"Description"}
          type={"text"}
          id="description"
          name="description"
          value={formData.description}
          placeholder="Describe your item"
          onChange={handleInputChange}
          options={{
            multiline: true,
            minRows: 4,
            maxRows: 8,
          }}
        />

        <div className={styles.price_block}>
          <FormInput
            label={"Price"}
            type={"number"}
            id={"price"}
            name={"price"}
            value={formData.price}
            onChange={handleInputChange}
          />
          <FormSelect
            label="Currency"
            id={"currency"}
            onChange={(_, newValue) => {
              handleSelectChange("currency", newValue?.value || "EUR")
            }}
            options={currencyRates.map(r => ({
              value: r[0],
              label: r[0],
            }))}
          />
          <div>EUR Price: {getEURPrice(formData.price, formData.currency)}</div>
        </div>
        <FormSelect<{
          category: string
          subcategory: string
        }>
          label={"Category"}
          id={"category"}
          onChange={(_, newValue) => {
            handleSelectChange("category", newValue?.category || "Other")
            handleSelectChange("subcategory", newValue?.subcategory || "Other")
          }}
          options={subcategories}
        />

        <FormSelect
          label={"Condition"}
          id={"condition"}
          onChange={(_, newValue) => {
            handleSelectChange("condition", newValue?.value || "EUR")
          }}
          options={Object.values(CONDITION).map(c => ({
            value: c,
            label: prepareCategoryText(c),
          }))}
        />

        <div className={styles.item_option_block}>
          <FormCheckBox
            label={"Free"}
            id={"isFree"}
            name={"isFree"}
            checked={formData.isFree}
            onChange={(_, checked) => handleCheckboxChange("isFree", checked)}
          />
          <FormCheckBox
            label={"Published"}
            id={"isPublished"}
            name={"isPublished"}
            checked={formData.isPublished}
            onChange={(_, checked) =>
              handleCheckboxChange("isPublished", checked)
            }
          />
        </div>

        <FormFiles files={files} setFiles={files => setFiles(files)} />

        <Button
          sx={{ marginLeft: "auto" }}
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Item"}
        </Button>
      </form>
    </div>
  )
}

export default NewItemForm
