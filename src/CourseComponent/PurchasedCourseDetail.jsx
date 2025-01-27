import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import videoIcon from "../images/video.png";

const PurchasedCourseDetail = () => {
  const { courseId } = useParams();

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

  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState({
    sectionIndex: null,
    topicIndex: null,
  });

  useEffect(() => {
    const getCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/course/fetch/course-id?videoShow=Yes&courseId=${courseId}`
        );
        setCourse(response.data.course);
      } catch (error) {
        console.error("Error fetching course:", error);
      }
    };
    getCourse();
  }, [courseId]);

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

  const getFileExtension = (fileName) => {
    return fileName.slice(fileName.lastIndexOf("."));
  };

  const downloadNotes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/course/notes/${course.notesFileName}/download`,
        {
          responseType: "blob", // Important to handle binary data
        }
      );

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a download link and trigger the download
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);

      link.download = "Course_Notes" + getFileExtension(course.notesFileName);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading course notes:", error);
      // Handle error as needed
    }
  };

  return (
    <div className="mt-5 mb-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-9 ms-5 mb-5">
            <h3 className="mt-2">Trainer</h3>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={`http://localhost:8080/api/user/${course.mentor.mentorDetail.profilePic}`}
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
            <h2 className="mt-5">{course.name}</h2>
            <div className="mt-3">{course.description}</div>

            <h3 className="mt-5">Chapters</h3>

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

            <h3 className="mt-5">Notes</h3>

            <input
              type="submit"
              className="btn bg-color text-color mt-4 mb-5"
              value="Download Notes"
              onClick={() => downloadNotes()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchasedCourseDetail;
