export interface Region{
    cities: string[];
    country_code: string;
    region: string;
}

export interface City{
    id: string;
    city: string;
    country_code: string;
    region: string;
    created_at: string;
    updated_at: string;
}