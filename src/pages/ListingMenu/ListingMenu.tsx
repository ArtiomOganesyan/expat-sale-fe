import Stack from "@mui/material/Stack"
import { Link } from "react-router"
import en from "./i18n/en.json"
import ru from "./i18n/ru.json"
import { useCustomTranslation } from "../../hooks/useCustomTranslation"

function ListingMenu() {
  const { t } = useCustomTranslation("listingMenu", en, ru)

  return (
    <div
      style={{
        display: "flex",
        padding: "1rem",
        flexWrap: "wrap",
      }}
    >
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?category=housing">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            {t("Housing")}
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?category=transportation">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Transportation
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?category=electronics">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Electronics
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?category=furniture">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Furniture
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?category=clothing">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Clothing
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?category=kids">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Baby & Kids
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?category=services">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Job & Services
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?category=pets">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Pets
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "100%" }}>
        <Link to="/listing?category=events">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Garage Sales
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing?is_free=true">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Free Things
          </div>
        </Link>
      </div>
      <div style={{ padding: "1rem", position: "relative", width: "50%" }}>
        <Link to="/listing">
          <div
            style={{
              border: "1px solid grey",
              borderRadius: "8px",
              padding: "1rem",
              cursor: "pointer",
            }}
          >
            Other Listings
          </div>
        </Link>
      </div>
    </div>
  )
}

export default ListingMenu
