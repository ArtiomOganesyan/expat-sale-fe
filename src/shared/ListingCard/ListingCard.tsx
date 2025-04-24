import Carousel from "react-material-ui-carousel"
import { Link } from "react-router"

function ListingCard(props: any) {
  return (
    <div className={props.className}>
      {/* <div style={{ borderBottom: "1px solid #ccc" }}> */}
      {props.images?.length ? (
        <Carousel autoPlay={false} animation="slide" indicators={true}>
          {props.images.map((image: string) => (
            <img
              style={{
                objectFit: "contain",
                width: "100%",
              }}
              src={image}
              alt="product"
            />
          ))}
        </Carousel>
      ) : null}
      {/* <div style={{ marginTop: "1rem" }}>
          <Link to={`/listing/${props.id}`}>
            <div>{props.title}</div>
            <div>
              {props.price} {props.currency}
            </div>
          </Link>
        </div> */}
    </div>
    // </div>
  )
}

export default ListingCard
