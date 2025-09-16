export const CATEGORIES = {
  HOUSING: 'housing',
  TRANSPORTATION: 'transportation',
  ELECTRONICS: 'electronics',
  FURNITURE: 'furniture',
  CLOTHING: 'clothing',
  KIDS: 'kids',
  SERVICES: 'services',
  PETS: 'pets',
  OTHER: 'other',
};

export const SUBCATEGORIES = {
  APARTMENT_RENT: 'apartment_rent',
  HOUSE_RENT: 'house_rent',
  SHARED_HOUSING: 'shared_housing',
  HOME_SALE: 'home_sale',
  CAR_SALE: 'car_sale',
  MOTORCYCLE_SALE: 'bike_sale',
  MOTORCYCLE_RENT: 'bike_rent',
  CAR_RENT: 'car_rent',
  PHONE: 'phones_and_accessories',
  COMPUTER: 'computers_and_accessories',
  HOME_APPLIANCES: 'home_appliances',
  AUDIO_VIDEO: 'audio_and_video',
  LIVING_ROOM: 'living_room_furniture',
  BEDROOM: 'bedroom_furniture',
  OFFICE: 'office_furniture',
  STORAGE: 'storage_furniture',
  MEN_CLOTHING: 'men_clothing',
  WOMEN_CLOTHING: 'women_clothing',
  SHOES_ACCESSORIES: 'shoes_and_accessories',
  BAGS: 'bags',
  BABY_GEAR: 'baby_gear',
  TOYS: 'toys',
  KIDS_CLOTHING: 'kids_clothing',
  EDUCATION: 'educational_materials',
  JOBS: 'jobs',
  HOME_SERVICES: 'home_services',
  BEAUTY_SERVICES: 'beauty_services',
  LANGUAGE_SERVICES: 'language_services',
  FREELANCE: 'freelance',
  PET_ADAPTION: 'pets_adoption',
  PET_SUPPLY: 'pet_supplies',
  PET_SERVICE: 'pet_services',
  BOOK: 'books',
  MUSIC: 'music_instruments',
  COLLECTIBLES: 'collectibles_and_art',
  CAMPING: 'camping_and_outdoor',
  OTHER: 'other',
};

export const categoryToSubcategoriesMapping = {
  [CATEGORIES.HOUSING]: [
    SUBCATEGORIES.APARTMENT_RENT,
    SUBCATEGORIES.HOUSE_RENT,
    SUBCATEGORIES.SHARED_HOUSING,
    SUBCATEGORIES.HOME_SALE,
  ],
  [CATEGORIES.TRANSPORTATION]: [
    SUBCATEGORIES.MOTORCYCLE_RENT,
    SUBCATEGORIES.MOTORCYCLE_SALE,
    SUBCATEGORIES.CAR_RENT,
    SUBCATEGORIES.CAR_SALE,
  ],
  [CATEGORIES.ELECTRONICS]: [
    SUBCATEGORIES.PHONE,
    SUBCATEGORIES.COMPUTER,
    SUBCATEGORIES.HOME_APPLIANCES,
    SUBCATEGORIES.AUDIO_VIDEO,
  ],
  [CATEGORIES.FURNITURE]: [SUBCATEGORIES.LIVING_ROOM, SUBCATEGORIES.BEDROOM, SUBCATEGORIES.OFFICE, SUBCATEGORIES.STORAGE],
  [CATEGORIES.CLOTHING]: [
    SUBCATEGORIES.MEN_CLOTHING,
    SUBCATEGORIES.WOMEN_CLOTHING,
    SUBCATEGORIES.SHOES_ACCESSORIES,
    SUBCATEGORIES.BAGS,
  ],
  [CATEGORIES.KIDS]: [SUBCATEGORIES.BABY_GEAR, SUBCATEGORIES.TOYS, SUBCATEGORIES.KIDS_CLOTHING],
  [CATEGORIES.SERVICES]: [
    SUBCATEGORIES.EDUCATION,
    SUBCATEGORIES.JOBS,
    SUBCATEGORIES.HOME_SERVICES,
    SUBCATEGORIES.BEAUTY_SERVICES,
    SUBCATEGORIES.LANGUAGE_SERVICES,
    SUBCATEGORIES.FREELANCE,
  ],
  [CATEGORIES.PETS]: [SUBCATEGORIES.PET_ADAPTION, SUBCATEGORIES.PET_SUPPLY, SUBCATEGORIES.PET_SERVICE],
  [CATEGORIES.OTHER]: [
    SUBCATEGORIES.BOOK,
    SUBCATEGORIES.MUSIC,
    SUBCATEGORIES.COLLECTIBLES,
    SUBCATEGORIES.CAMPING,
    SUBCATEGORIES.OTHER,
  ],
};

export const CONDITION = {
  NEW: 'new',
  USED: 'used',
};

export const LOCAL_STORAGE_KEY_CURRENCY = 'userCurrency';
export const LOCAL_STORAGE_KEY_LANGUAGE = 'userLanguage';
