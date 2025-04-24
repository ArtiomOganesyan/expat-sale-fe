export const formChangeHandler = (setter: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setter((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (key: string, value: any) => {
    setter((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setter((prev: any) => ({
      ...prev,
      [key]: checked,
    }))
  }

  return {
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
  }
}
