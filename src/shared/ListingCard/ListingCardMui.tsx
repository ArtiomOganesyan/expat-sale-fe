import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Typography from "@mui/material/Typography"
import Carousel from "react-material-ui-carousel"
import {
  Box,
  CardActionArea,
  IconButton,
  Paper,
  useMediaQuery,
} from "@mui/material"
import styles from "./ListingCard.module.css"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"

type ListingCardProps = {
  images: Array<string>
  title: string
  id: string
  className: string
  size: "small" | "large"
}

export const ListingCard: React.FC<ListingCardProps> = props => {
  const { images, title, id, className, size } = props

  const matches = useMediaQuery("(max-width: 480px)")

  return (
    <Paper className={`${className}`} elevation={10}>
      <Card
        className={`${className}`}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 0,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: size === "large" ? "92%" : "85%",
            display: "flex",
          }}
        >
          <Carousel
            indicators={false}
            sx={{ width: "100%", height: "100%" }}
            navButtonsAlwaysInvisible={matches}
          >
            {images.map((image, index) => {
              return (
                <CardActionArea
                  onClick={() => console.log("Card")}
                  data-active={id}
                  sx={{
                    height: "100%",
                    width: "100%",
                    "&[data-active]": {
                      backgroundColor: "action.selected",
                      "&:hover": {
                        backgroundColor: "action.selectedHover",
                      },
                    },
                  }}
                >
                  <CardMedia
                    key={index}
                    component="img"
                    image={image}
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                    }}
                  />
                </CardActionArea>
              )
            })}
          </Carousel>
        </Box>
        <CardContent
          sx={{
            width: "100%",
            minHeight: size === "large" ? "8%" : "15%",
            display: "flex",
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "0 !important",
          }}
        >
          <Box
            sx={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", marginLeft: "5px" }}
            >
              Price:
            </Typography>
          </Box>
          <Box>
            <IconButton size="small">{<FavoriteBorderIcon />}</IconButton>
          </Box>
        </CardContent>
      </Card>
    </Paper>
  )
}
