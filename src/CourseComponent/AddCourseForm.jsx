import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCourseForm = () => {
  const [categories, setCategories] = useState([]);

  const mentor = JSON.parse(sessionStorage.getItem("active-mentor"));
  const mentor_jwtToken = sessionStorage.getItem("mentor-jwtToken");

  let navigate = useNavigate();

  const retrieveAllCategories = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/course/category/fetch/all"
    );
    return response.data;
  };

  useEffect(() => {
    const getAllCategories = async () => {
      const resCategory = await retrieveAllCategories();
      if (resCategory) {
        setCategories(resCategory.categories);
      }
    };

    getAllCategories();
  }, []);

  const [selectedNotesFile, setSelectedNotesFile] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  const [course, setCourse] = useState({
    mentorId: mentor.id,
    categoryId: "",
    name: "",
    description: "",
    type: "Paid",
    fee: 0.0,
    discountInPercent: 0,
    authorCourseNote: "",
    specialNote: "",
    prerequisite: "",
  });

  const handleInput = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const saveCourse = (e) => {
    e.preventDefault();
    if (course === null) {
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
    }

    if (course.categoryId === "" || course.categoryId === "0") {
      toast.error("Select Category!!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    if (course.type === "" || course.type === "0") {
      toast.error("Select Course Type!!!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      return;
    }

    const formData = new FormData();
    formData.append("name", course.name);
    formData.append("description", course.description);
    formData.append("type", course.type);
    formData.append("fee", course.fee);
    formData.append("discountInPercent", course.discountInPercent);
    formData.append("thumbnail", selectedThumbnail);
    formData.append("notesFileName", selectedNotesFile);
    formData.append("prerequisite", course.prerequisite);
    formData.append("authorCourseNote", course.authorCourseNote);
    formData.append("specialNote", course.specialNote);
    formData.append("categoryId", course.categoryId);
    formData.append("mentorId", course.mentorId);

    axios
      .post("http://localhost:8080/api/course/add", formData, {
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

          setTimeout(() => {
            navigate("/mentor/course/section/add", { state: response.course });
          }, 2000); // Redirect after 3 seconds
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
  };

  const convertToEpochTime = (dateString) => {
    const selectedDate = new Date(dateString);
    const epochTime = selectedDate.getTime();
    return epochTime;
  };

  return (
    <div>
      <div class="mt-2 d-flex aligns-items-center justify-content-center mb-4">
        <div class="card form-card shadow-lg" style={{ width: "60rem" }}>
          <div className="container-fluid">
            <div
              className="card-header bg-color custom-bg-text mt-2 text-center"
              style={{
                borderRadius: "1em",
                height: "45px",
              }}
            >
              <h5 class="card-title">Add Course</h5>
            </div>
            <div class="card-body text-color">
              <form className="row g-3">
                <div className="col-md-6 mb-3">
                  <label htmlFor="title" className="form-label">
                    <b>Course Title</b>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    onChange={handleInput}
                    value={course.name}
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="description" class="form-label">
                    <b>Course Description</b>
                  </label>
                  <textarea
                    class="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="enter description.."
                    onChange={handleInput}
                    value={course.description}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Course Category</b>
                  </label>

                  <select
                    name="categoryId"
                    onChange={handleInput}
                    className="form-control"
                  >
                    <option value="">Select Course Category</option>

                    {categories.map((category) => {
                      return (
                        <option value={category.id}> {category.name} </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    <b>Course Type</b>
                  </label>

                  <select
                    name="type"
                    onChange={handleInput}
                    className="form-control"
                  >
                    <option value="">Select Course Type</option>
                    <option value="Paid"> Paid </option>
                    <option value="Free"> Free </option>
                  </select>
                </div>

                {(() => {
                  if (course.type === "Paid") {
                    return (
                      <div className="col-md-6 mb-3">
                        <label htmlFor="title" className="form-label">
                          <b>Course Fee</b>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="fee"
                          name="fee"
                          onChange={handleInput}
                          value={course.fee}
                        />
                      </div>
                    );
                  }
                })()}

                {(() => {
                  if (course.type === "Paid") {
                    return (
                      <div className="col-md-6 mb-3">
                        <label htmlFor="street" className="form-label">
                          <b>Discount (in %)</b>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          id="discountInPercent"
                          name="discountInPercent"
                          onChange={handleInput}
                          value={course.discountInPercent}
                        />
                      </div>
                    );
                  }
                })()}

                <div class="col-md-6 mb-3">
                  <label for="description" class="form-label">
                    <b>Author Note About Course</b>
                  </label>
                  <textarea
                    class="form-control"
                    id="description"
                    rows="3"
                    name="authorCourseNote"
                    placeholder="enter author note.."
                    onChange={handleInput}
                    value={course.authorCourseNote}
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label for="description" class="form-label">
                    <b>Special Note</b>
                  </label>
                  <textarea
                    class="form-control"
                    id="description"
                    name="specialNote"
                    rows="3"
                    placeholder="enter special note.."
                    onChange={handleInput}
                    value={course.specialNote}
                  />
                </div>
                <div class="col-md-6 mb-3">
                  <label for="description" class="form-label">
                    <b>Course Prerequisite</b>
                  </label>
                  <textarea
                    class="form-control"
                    id="prerequisite"
                    name="prerequisite"
                    rows="3"
                    placeholder="enter prerequisite.."
                    onChange={handleInput}
                    value={course.prerequisite}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label for="formFile" class="form-label">
                    <b> Select Course Note</b>
                  </label>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    onChange={(e) => setSelectedNotesFile(e.target.files[0])}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label for="formFile" class="form-label">
                    <b> Select Thumbnail</b>
                  </label>
                  <input
                    class="form-control"
                    type="file"
                    id="formFile"
                    onChange={(e) => setSelectedThumbnail(e.target.files[0])}
                    required
                  />
                </div>
                <div className="d-flex aligns-items-center justify-content-center mb-2">
                  <button
                    type="submit"
                    class="btn bg-color custom-bg-text"
                    onClick={saveCourse}
                  >
                    Add Course
                  </button>
                  <ToastContainer />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseForm;
