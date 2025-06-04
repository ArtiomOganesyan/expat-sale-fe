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
  Skeleton,
  useMediaQuery,
} from "@mui/material"
import styles from "./ListingCard.module.css"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import { forwardRef, useCallback, useState } from "react"

type ListingCardProps = {
  images: Array<string>
  title: string
  id: string
  className: string
  size: "small" | "large"
}

type MyPaperProps = {
  className?: string
  children?: React.ReactNode
}

const MyPaper = forwardRef<HTMLDivElement, MyPaperProps>(
  ({ className, children }, ref) => {
    return (
      <Paper className={className} elevation={10} ref={ref}>
        {children}
      </Paper>
    )
  },
)

export const ListingCard: React.FC<ListingCardProps> = forwardRef<
  HTMLDivElement,
  ListingCardProps
>((props, ref) => {
  const { images, title, id, className, size } = props
  const [height, setHeight] = useState<number | null>(null)

  const matches = useMediaQuery("(max-width: 480px)")

  const [isLoaded, setIsLoaded] = useState(false)

  const imgRef = useCallback((node: HTMLImageElement | null) => {
    if (!node) return

    const updateSize = () => {
      const width = node.offsetWidth
      setHeight(width)
    }

    if (node) {
      updateSize()
    }

    window.addEventListener("resize", updateSize)

    return () => {
      window.removeEventListener("resize", updateSize)
    }
  }, [])

  return (
    <MyPaper className={`${className}`} ref={ref}>
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
                  {!isLoaded && (
                    <Skeleton
                      variant="rectangular"
                      ref={imgRef}
                      sx={{
                        display: "block",
                      }}
                      width="100%"
                      height={`${height ? `${height}px` : "100%"}`}
                      animation="wave"
                    />
                  )}
                  <CardMedia
                    component="img"
                    // ref={imgRef}
                    image={image}
                    onLoad={() => setIsLoaded(true)}
                    sx={{
                      display: "block",
                    }}
                  />
                </CardActionArea>
              )
            })}
          </Carousel>
        </Box>
        {!isLoaded ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={`${height ? `${height}px` : "100%"}`}
            animation="wave"
          />
        ) : (
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
        )}
      </Card>
    </MyPaper>
  )
})
