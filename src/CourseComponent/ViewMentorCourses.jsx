import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const ViewMentorCourses = () => {
  const [courses, setCourses] = useState([]);
  const mentor_jwtToken = sessionStorage.getItem("mentor-jwtToken");
  const mentor = JSON.parse(sessionStorage.getItem("active-mentor"));

  let navigate = useNavigate();

  useEffect(() => {
    const getAllCourses = async () => {
      const coursesRes = await retrieveAllCourse();
      if (coursesRes) {
        setCourses(coursesRes.courses);
      }
    };

    getAllCourses();
  }, []);

  const retrieveAllCourse = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/course/fetch/mentor-wise?status=Active&videoShow=Yes&mentorId=" +
        mentor.id
    );
    console.log(response.data);
    return response.data;
  };

  const deleteCourse = (courseId, e) => {
    fetch("http://localhost:8080/api/course/delete?courseId=" + courseId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        //    Authorization: "Bearer " + mentor_jwtToken,
      },
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });

            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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
            setTimeout(() => {
              window.location.reload(true);
            }, 1000); // Redirect after 3 seconds
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
        setTimeout(() => {
          window.location.reload(true);
        }, 1000); // Redirect after 3 seconds
      });
  };

  const addSection = (course) => {
    navigate("/mentor/course/section/add", { state: course });
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 shadow-lg"
        style={{
          height: "45rem",
        }}
      >
        <div
          className="card-header custom-bg-text text-center bg-color"
          style={{
            borderRadius: "1em",
            height: "50px",
          }}
        >
          <h2>My Listed Course</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Thumnail</th>
                  <th scope="col">Course Name</th>
                  <th scope="col">Description</th>
                  <th scope="col">Type</th>
                  <th scope="col">Price</th>
                  <th scope="col">Discount</th>
                  <th scope="col">Added Time</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  return (
                    <tr>
                      <td>
                        <img
                          src={
                            "http://localhost:8080/api/course/" +
                            course.thumbnail
                          }
                          class="img-fluid"
                          alt="thumbnail"
                          style={{
                            maxWidth: "90px",
                          }}
                        />
                      </td>
                      <td>
                        <b>{course.name}</b>
                      </td>
                      <td>
                        <b>{course.description}</b>
                      </td>
                      <td>
                        <b>{course.type}</b>
                      </td>
                      <td>
                        <b>{course.fee}</b>
                      </td>
                      <td>
                        <b>{course.discountInPercent}</b>
                      </td>
                      <td>
                        <b>{formatDateFromEpoch(course.addedDateTime)}</b>
                      </td>
                      <td>
                        <button
                          onClick={() => addSection(course)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          Update
                        </button>

                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="btn btn-sm bg-color custom-bg-text ms-2"
                        >
                          Delete
                        </button>
                        <ToastContainer />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMentorCourses;
