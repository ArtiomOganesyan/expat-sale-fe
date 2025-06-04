import { http, HttpResponse } from "msw"
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string
export const handlers = [
  http.get(`${BACKEND_URL}currency/rates`, () => {
    return HttpResponse.json(
      {
        Rates: {
          USD: 1,
          EUR: 0.92,
          GBP: 0.78,
        },
      },
      {
        status: 200,
        statusText: "Mocked status",
      },
    )
  }),
]
