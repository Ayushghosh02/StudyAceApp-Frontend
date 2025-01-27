import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useLocation, Link } from "react-router-dom";
import videoIcon from "../images/video.png";
import { Button, Modal } from "react-bootstrap";

const AddCourseSectionForm = () => {
  const location = useLocation();
  const [course, setCourse] = useState(location.state);

  const mentor = JSON.parse(sessionStorage.getItem("active-mentor"));
  const mentor_jwtToken = sessionStorage.getItem("mentor-jwtToken");

  let navigate = useNavigate();

  const [showSectionModal, setShowSectionModal] = useState(false);
  const handleSectionClose = () => setShowSectionModal(false);
  const handleSectionShow = () => setShowSectionModal(true);

  const showCourseSectionForm = () => {
    handleSectionShow();
  };

  const [showSectionTopicModal, setShowSectionTopicModal] = useState(false);
  const handleSectionTopicClose = () => setShowSectionTopicModal(false);
  const handleSectionTopicShow = () => setShowSectionTopicModal(true);

  const showCourseSectionTopicForm = (sectionId) => {
    setSectionId(sectionId);
    handleSectionTopicShow();
  };

  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState({
    sectionIndex: null,
    topicIndex: null,
  });

  const toggleSection = (sectionIndex, topicIndex) => {
    if (
      expandedSection === sectionIndex &&
      expandedTopic.topicIndex === topicIndex
    ) {
      // Collapse the section and topic
      setExpandedSection(null);
      setExpandedTopic({
        sectionIndex: null,
        topicIndex: null,
      });
    } else {
      // Expand the section and topic
      setExpandedSection(sectionIndex);
      setExpandedTopic({
        sectionIndex,
        topicIndex,
      });
    }
  };
  const handleInput = (e) => {
    setCourseSection({ ...courseSection, [e.target.name]: e.target.value });
  };

  const handleTopicInput = (e) => {
    setCourseSectionTopic({
      ...courseSectionTopic,
      [e.target.name]: e.target.value,
    });
  };

  const [courseSection, setCourseSection] = useState({
    courseId: course.id,
    srNo: "",
    name: "",
    description: "",
  });

  const [courseSectionTopic, setCourseSectionTopic] = useState({
    srNo: "",
    name: "",
    description: "",
  });

  const [sectionId, setSectionId] = useState("");
  const [selectedTopicVideo, setSelectedTopicVideo] = useState(null);

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

  const saveCourseSection = (e) => {
    e.preventDefault();
    if (courseSection === null || courseSection.courseId === 0) {
      toast.error("invalid input!!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    } else {
      fetch("http://localhost:8080/api/course/section/add", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          //Authorization: "Bearer " + admin_jwtToken,
        },
        body: JSON.stringify(courseSection),
      })
        .then((result) => {
          result.json().then((res) => {
            if (res.success) {
              toast.success(res.responseMessage, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });

              setCourseSection({
                courseId: course.id,
                srNo: "",
                name: "",
                description: "",
              });
              setCourse(res.course);
              handleSectionClose();
              // setTimeout(() => {
              //   navigate("/home");
              // }, 2000); // Redirect after 3 seconds
            } else if (!res.success) {
              toast.error(res.responseMessage, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              // setTimeout(() => {
              //   window.location.reload(true);
              // }, 2000); // Redirect after 3 seconds
            } else {
              toast.error("It Seems Server is down!!!", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              // setTimeout(() => {
              //   window.location.reload(true);
              // }, 2000); // Redirect after 3 seconds
            }
          });
        })
        .catch((error) => {
          console.error(error);
          toast.error("It seems server is down", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // setTimeout(() => {
          //   window.location.reload(true);
          // }, 1000); // Redirect after 3 seconds
        });
      e.preventDefault();
    }
  };

  const saveCourseSectionTopic = (e) => {
    e.preventDefault();
    if (sectionId === "") {
      toast.error("invalid input!!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    } else {
      const formData = new FormData();
      formData.append("sectionId", sectionId);
      formData.append("srNo", courseSectionTopic.srNo);
      formData.append("name", courseSectionTopic.name);
      formData.append("description", courseSectionTopic.description);
      formData.append("video", selectedTopicVideo);

      axios
        .post("http://localhost:8080/api/course/section/topic/add", formData, {
          headers: {
            //    Authorization: "Bearer " + admin_jwtToken, // Replace with your actual JWT token
          },
        })
        .then((resp) => {
          let response = resp.data;

          if (response.success) {
            toast.success(response.responseMessage, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            setCourseSectionTopic({
              srNo: "",
              name: "",
              description: "",
            });
            setSectionId("");
            setSelectedTopicVideo(null);
            setCourse(response.course);
            handleSectionTopicClose();
          } else if (!response.success) {
            toast.error(response.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 2000); // Redirect after 3 seconds
          } else {
            toast.error("It Seems Server is down!!!", {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            // setTimeout(() => {
            //   window.location.reload(true);
            // }, 2000); // Redirect after 3 seconds
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("It seems server is down", {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // setTimeout(() => {
          //   window.location.reload(true);
          // }, 2000); // Redirect after 3 seconds
        });
    }
    e.preventDefault();
  };

  return (
    <div className="mt-5 mb-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-6 ms-5 mb-5">
            <h2>{course.name}</h2>
            <div className="mt-3">{course.description}</div>

            <h3 className="mt-5">Chapters</h3>

            <button
              type="submit"
              class="btn bg-color text-color mt-3 mb-3"
              onClick={showCourseSectionForm}
            >
              Add Chapter
            </button>

            <div className="list-group mt-4">
              {course.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="rounded-3 mb-3">
                  {/* Section header */}
                  <button
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                      expandedSection === sectionIndex ? "active" : ""
                    }`}
                    onClick={() => toggleSection(sectionIndex, null)}
                    style={{
                      backgroundColor:
                        expandedSection === sectionIndex ? "#f0ad4e" : "#fff",
                      borderColor:
                        expandedSection === sectionIndex
                          ? "#f0ad4e"
                          : "#dee2e6",
                      borderBottomLeftRadius: "0.25rem",
                      borderBottomRightRadius: "0.25rem",
                    }}
                    aria-controls={`section-${sectionIndex}-topics`}
                    aria-expanded={
                      expandedSection === sectionIndex ? "true" : "false"
                    }
                  >
                    <span>
                      <span className="badge bg-dark text-light rounded-pill me-1">
                        {section.srNo}
                      </span>
                      <span>
                        <b>{section.name}</b>
                      </span>
                    </span>
                    <span className="badge bg-dark rounded-pill me-1">
                      {section.courseSectionTopics.length}
                    </span>
                  </button>

                  {/* Collapsible topics list */}
                  <div
                    className={`collapse ${
                      expandedSection === sectionIndex ? "show" : ""
                    }`}
                    id={`section-${sectionIndex}-topics`}
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderBottomLeftRadius: "0.25rem",
                      borderBottomRightRadius: "0.25rem",
                    }}
                  >
                    <button
                      type="submit"
                      class="btn bg-color text-color mt-3 ms-4"
                      onClick={(e) => showCourseSectionTopicForm(section.id)}
                    >
                      Add Topic
                    </button>

                    <p className="ms-4 mt-2">{section.description}</p>
                    <ul className="list-group list-group-flush">
                      {section.courseSectionTopics.map((topic, topicIndex) => (
                        <li
                          key={topicIndex}
                          className="list-group-item"
                          onClick={() =>
                            toggleSection(sectionIndex, topicIndex)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <span className="ms-4">
                            <img
                              src={videoIcon}
                              alt="Video Icon"
                              className="me-2"
                              style={{
                                maxWidth: "18px",
                              }}
                            />
                            <b>
                              {topic.srNo} - {topic.name}
                            </b>
                          </span>
                          {/* Description and Video Player */}
                          {expandedTopic.sectionIndex === sectionIndex &&
                            expandedTopic.topicIndex === topicIndex && (
                              <div className="mt-2 ms-4">
                                <p className="mt-3">{topic.description}</p>
                                <video
                                  controls
                                  src={`http://localhost:8080/api/course/video/${topic.videoFileName}`}
                                  className="w-100 mt-3"
                                />
                              </div>
                            )}
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
                      </div>
                    );
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

      <Modal show={showSectionModal} onHide={handleSectionClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Add Course Section
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ms-3 mt-3 mb-3 me-3">
            <form className="row g-3">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  <b>Sr No</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="srNo"
                  name="srNo"
                  onChange={handleInput}
                  value={courseSection.srNo}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  <b>Section Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  onChange={handleInput}
                  value={courseSection.name}
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">
                  <b>Section Description</b>
                </label>
                <textarea
                  class="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="enter description.."
                  onChange={handleInput}
                  value={courseSection.description}
                />
              </div>

              <div className="d-flex aligns-items-center justify-content-center mb-2">
                <button
                  type="submit"
                  class="btn bg-color custom-bg-text"
                  onClick={saveCourseSection}
                >
                  Add Course Section
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSectionClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSectionTopicModal} onHide={handleSectionTopicClose}>
        <Modal.Header closeButton className="bg-color custom-bg-text">
          <Modal.Title
            style={{
              borderRadius: "1em",
            }}
          >
            Add Section Topic
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ms-3 mt-3 mb-3 me-3">
            <form className="row g-3">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  <b>Sr No</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="srNo"
                  name="srNo"
                  onChange={handleTopicInput}
                  value={courseSectionTopic.srNo}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  <b>Section Name</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  onChange={handleTopicInput}
                  value={courseSectionTopic.name}
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">
                  <b>Section Description</b>
                </label>
                <textarea
                  class="form-control"
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="enter description.."
                  onChange={handleTopicInput}
                  value={courseSectionTopic.description}
                />
              </div>

              <div className="mb-3">
                <label for="formFile" class="form-label">
                  <b> Select Topic Video</b>
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  onChange={(e) => setSelectedTopicVideo(e.target.files[0])}
                  required
                />
              </div>

              <div className="d-flex aligns-items-center justify-content-center mb-2">
                <button
                  type="submit"
                  class="btn bg-color custom-bg-text"
                  onClick={saveCourseSectionTopic}
                >
                  Add Section Topic
                </button>
                <ToastContainer />
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleSectionTopicClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCourseSectionForm;
