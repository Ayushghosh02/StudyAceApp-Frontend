import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import videoIcon from "../images/video.png";

const CourseDetailPage = () => {
  const { courseId } = useParams();

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const mentor = JSON.parse(sessionStorage.getItem("active-mentor"));
  const mentor_jwtToken = sessionStorage.getItem("mentor-jwtToken");

  const navigate = useNavigate();
  const [isCoursePurchased, setIsCoursePurchased] = useState("No");
  const [expandedSection, setExpandedSection] = useState(null);

  // Function to toggle the expanded section
  const toggleSection = (index) => {
    if (expandedSection === index) {
      setExpandedSection(null); // Collapse if clicked again
    } else {
      setExpandedSection(index); // Expand clicked section
    }
  };

  const [course, setCourse] = useState({
    id: "",
    mentor: {
      id: "",
      firstName: "",
      lastName: "",
      emailId: "",
      phoneNo: "",
      role: "",
      address: {
        id: "",
        street: "",
        city: "",
        pincode: "",
      },
      mentorDetail: {
        id: "",
        bio: "",
        age: "",
        highestQualification: "",
        profession: "",
        experience: "",
        profilePic: "",
      },
      amount: "",
      status: "",
    },
    category: {
      id: "",
      name: "",
      description: "",
      status: "",
    },
    name: "",
    description: "",
    type: "",
    fee: "",
    addedDateTime: "",
    notesFileName: "",
    thumbnail: "",
    status: "",
    sections: [
      {
        id: "",
        srNo: "",
        name: "",
        description: "",
        courseSectionTopics: [
          {
            id: "",
            srNo: "",
            name: "",
            description: "",
            videoFileName: "",
          },
        ],
      },
    ],
  });

  useEffect(() => {
    const getCourse = async () => {
      const fetchCourseResonse = await retrieveCourse();
      if (fetchCourseResonse) {
        setCourse(fetchCourseResonse.course);

        if (
          fetchCourseResonse &&
          fetchCourseResonse.isCoursePurchased !== null &&
          fetchCourseResonse.isCoursePurchased === "Yes"
        ) {
          setIsCoursePurchased(fetchCourseResonse.isCoursePurchased);
        }
      }
    };
    getCourse();
  }, []);

  const retrieveCourse = async () => {
    let customerId = customer && customer !== null ? customer.id : 0;

    const response = await axios.get(
      "http://localhost:8080/api/course/fetch/course-user-id?courseId=" +
        courseId +
        "&userId=" +
        customerId
    );
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  // Method to return total number of sections
  const getTotalSections = (sections) => {
    return sections.length;
  };

  // Method to return total number of course topics
  const getTotalCourseTopics = (sections) => {
    let totalTopics = 0;
    sections.forEach((section) => {
      totalTopics += section.courseSectionTopics.length;
    });
    return totalTopics;
  };

  function calculateFeeAfterDiscount(discountInPercent, fee) {
    // Calculate the discounted fee
    let discountedFee = fee - (fee * discountInPercent) / 100;

    // Format the discounted fee to two decimal places
    let feeAfterDiscount = discountedFee.toFixed(2);

    // Return the formatted string
    return feeAfterDiscount;
  }

  const viewCourseVideos = () => {
    if (customer === null) {
      alert("Please Login to view the course!!!");
    } else {
      navigate(`/course/${course.id}/videos`);
    }
  };

  const purchaseCourse = () => {
    if (customer === null) {
      alert("Please Login to purchase the course!!!");
    } else {
      navigate(`/course/${course.id}/payment/page`);
    }
  };

  return (
    <div className="mt-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-6 ms-5 mb-5">
            <h2>{course.name}</h2>
            <div className="mt-3">{course.description}</div>

            <h3 className="mt-5">Chapters</h3>

            <div className="list-group mt-4">
              {course.sections.map((section, index) => (
                <div key={index} className="rounded-3 mb-3">
                  {/* Section header */}
                  <button
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                      expandedSection === index ? "active" : ""
                    }`}
                    onClick={() => toggleSection(index)}
                    style={{
                      backgroundColor:
                        expandedSection === index ? "#f0ad4e" : "#fff",
                      borderColor:
                        expandedSection === index ? "#f0ad4e" : "#dee2e6",
                      borderBottomLeftRadius: "0.25rem",
                      borderBottomRightRadius: "0.25rem",
                    }}
                    aria-controls={`section-${index}-topics`}
                    aria-expanded={expandedSection === index ? "true" : "false"}
                  >
                    <span>
                      <span className="badge bg-dark text-light rounded-pill me-1">
                        {section.srNo}
                      </span>
                      <span>{section.name}</span>
                    </span>
                    <span className="badge bg-dark rounded-pill me-1">
                      {section.courseSectionTopics.length}
                    </span>
                  </button>

                  {/* Collapsible topics list */}
                  <div
                    className={`collapse ${
                      expandedSection === index ? "show" : ""
                    }`}
                    id={`section-${index}-topics`}
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderBottomLeftRadius: "0.25rem",
                      borderBottomRightRadius: "0.25rem",
                    }}
                  >
                    <ul className="list-group list-group-flush">
                      {section.courseSectionTopics.map((topic, idx) => (
                        <li key={idx} className="list-group-item">
                          <span className="ms-4">
                            <img
                              src={videoIcon}
                              alt="Video Icon"
                              className="me-2"
                              style={{
                                maxWidth: "18px",
                              }}
                            />
                            {/* Video icon */}
                            {topic.srNo} - {topic.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="mt-5">Author</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={
                  "http://localhost:8080/api/user/" +
                  course.mentor.mentorDetail.profilePic
                }
                className="card-img-top profile-photo mt-3 rounded-circle"
                alt="profile_pic"
              />
              <div className="ms-3">
                <Link
                  to={`/mentor/${course.mentor.id}/course/all`}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <h5 style={{ margin: "0" }}>
                    {`${course.mentor.firstName} ${course.mentor.lastName} [${course.mentor.mentorDetail.profession}]`}
                  </h5>
                </Link>
              </div>
            </div>
            <div className="mt-3">{course.authorCourseNote}</div>

            <h3 className="mt-5">Prerequisite</h3>
            {(() => {
              if (course.prerequisite) {
                // Split the string by "~" to get an array of prerequisites
                let prerequisitesArray = course.prerequisite.split("~");

                return (
                  <div>
                    {prerequisitesArray.map((prerequisite, index) => (
                      <div key={index} className="mt-3">
                        {"- " + prerequisite}
                      </div>
                    ))}
                  </div>
                );
              }
            })()}

            <div className="mt-5 mb-5">
              <span className="text-danger">
                <b> Note:</b>
                <span className=""> {course.specialNote}</span>
              </span>
            </div>
          </div>
          <div className="col-md-3">
            <div
              class="card rounded-card  shadow-lg"
              style={{ textDecoration: "none" }}
            >
              <div style={{ position: "relative", maxWidth: "100%" }}>
                <img
                  src={"http://localhost:8080/api/course/" + course.thumbnail}
                  className="card-img-top rounded d-block"
                  alt="img"
                  style={{
                    maxHeight: "270px",
                    maxWidth: "100%",
                    width: "auto",
                  }}
                />
              </div>

              <div class="card-body text-color">
                {(() => {
                  if (course.type === "Paid") {
                    return (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "start",
                          justifyContent: "start",
                          textAlign: "start",
                        }}
                      >
                        <h3 style={{ margin: "0", fontSize: "25px" }}>
                          &#8377;{" "}
                          {calculateFeeAfterDiscount(
                            course.discountInPercent,
                            course.fee
                          )}
                        </h3>
                        <p
                          className="text-muted"
                          style={{ margin: "0 0.5em", fontSize: "20px" }}
                        >
                          <strike>&#8377;{course.fee}</strike>
                        </p>
                        <p
                          className="discount-badge"
                          style={{
                            backgroundColor: "#fab440",
                            padding: "0.2em 0.4em",
                            borderRadius: "10px",
                            margin: "0 0.5em", // Adjust as needed
                            fontSize: "14px",
                          }}
                        >
                          {course.discountInPercent}% OFF
                        </p>
                      </div>
                    );
                  }
                })()}

                {(() => {
                  if (course.type === "Free") {
                    return (
                      <div className="mt-3 mb-4">
                        <button
                          type="submit"
                          class="btn bg-success text-white"
                          //    onClick={savecourse}
                        >
                          Free
                        </button>

                        <button
                          type="submit"
                          class="btn text-color-third ms-3"
                          style={{
                            borderColor: "#fab440",
                          }}
                          onClick={viewCourseVideos}
                        >
                          Start Course
                        </button>
                      </div>
                    );
                  } else {
                    if (isCoursePurchased === "Yes") {
                      return (
                        <div className="mt-3 mb-4">
                          <button
                            type="submit"
                            class="btn bg-success text-white"
                            //    onClick={savecourse}
                          >
                            Purchased
                          </button>

                          <button
                            type="submit"
                            class="btn text-color-third ms-3"
                            style={{
                              borderColor: "#fab440",
                            }}
                            onClick={viewCourseVideos}
                          >
                            Start Course
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <button
                          type="submit"
                          class="btn bg-color text-color mt-3"
                          onClick={purchaseCourse}
                        >
                          Buy Now
                        </button>
                      );
                    }
                  }
                })()}

                <hr />

                <div className="mt-2 ">
                  <p style={{ fontSize: "16px" }}>What's Included</p>
                  <p style={{ fontSize: "13px" }}>
                    + {getTotalSections(course.sections) + " Chapters"}
                  </p>
                  <p style={{ fontSize: "13px" }}>
                    + {getTotalCourseTopics(course.sections) + " Videos"}
                  </p>
                  <p style={{ fontSize: "13px" }}>+ Notes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
