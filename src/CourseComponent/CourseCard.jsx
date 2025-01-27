import { Link } from "react-router-dom";
import dollor from "../images/dollor_logo.png";
import timing from "../images/timing_logo.png";
import experience from "../images/experience_logo.png";

const CourseCard = (course) => {
  const descriptionToShow = (description, maxLength) => {
    if (description.length <= maxLength) {
      return description;
    } else {
      const truncatedText = description.substring(0, maxLength);
      return truncatedText + "...";
    }
  };

  return (
    <div className="col">
      <Link
        to={`/course/${course.item.id}/detail`}
        class="card course-card rounded-card h-100 shadow-lg"
        style={{ textDecoration: "none" }}
      >
        <div style={{ position: "relative", maxWidth: "100%" }}>
          <img
            src={"http://localhost:8080/api/course/" + course.item.thumbnail}
            className="card-img-top rounded d-block"
            alt="img"
            style={{
              maxHeight: "270px",
              maxWidth: "100%",
              width: "auto",
            }}
          />
          <b
            style={{
              backgroundColor:
                course.item.type === "Paid" ? "#fab440" : "greenyellow",
              display: "inline-block",
              borderRadius: "5px",
              padding: "0.2em 0.5em",
              position: "absolute",
              top: "10px", // Adjust top position as needed
              right: "10px", // Adjust right position as needed
              color: "#000000", // Text color
            }}
          >
            {course.item.type}
          </b>
        </div>

        <div class="card-body text-color">
          <h5 className="card-title d-flex justify-content-between text-color-second">
            <div>
              <b>{course.item.name}</b>
            </div>
          </h5>
          <p className="card-text">
            {descriptionToShow(course.item.description, 60)}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
