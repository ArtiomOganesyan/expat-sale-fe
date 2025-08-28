export const formChangeHandler = (setter: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For price: allow the empty string while editing (map to undefined)
    // so users can clear the field. Convert non-empty values to Number.
    const parsedValue = name === 'price' ? (value === '' ? undefined : Number(value)) : value;
    setter((prev: any) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSelectChange = (key: string, value: any) => {
    setter((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLocationChange = (parentKey: string, childKey: string, value: any) => {
    setter((prev: any) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setter((prev: any) => ({
      ...prev,
      [key]: checked,
    }));
  };

  return {
    handleInputChange,
    handleSelectChange,
    handleLocationChange,
    handleCheckboxChange,
  };
};
