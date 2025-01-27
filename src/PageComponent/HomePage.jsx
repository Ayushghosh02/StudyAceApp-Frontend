import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Carousel from "./Carousel";
import Footer from "../NavbarComponent/Footer";
import { useNavigate } from "react-router-dom";
import CourseCard from "../CourseComponent/CourseCard";
// import CourseCard from "../CourseComponent/CourseCard";

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [courseName, setcourseName] = useState("");
  const [eventCategoryId, setCourseCategoryId] = useState("");
  const [tempcourseName, setTempcourseName] = useState("");
  const [tempCourseCategoryId, setTempCourseCategoryId] = useState("");
  const [allCourse, setallCourse] = useState([]);

  const retrieveAllCategories = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/course/category/fetch/all"
    );
    return response.data;
  };

  useEffect(() => {
    console.log("texting");

    const getallCourse = async () => {
      const allCourse = await retrieveallCourse();
      if (allCourse) {
        setallCourse(allCourse.courses);
      }
    };

    const getSearchedCourses = async () => {
      const allCourse = await searchCourses();
      if (allCourse) {
        setallCourse(allCourse.courses);
      }
    };

    const getAllCategories = async () => {
      const resCategory = await retrieveAllCategories();
      if (resCategory) {
        setCategories(resCategory.categories);
      }
    };

    if (eventCategoryId !== "" || courseName !== "") {
      getSearchedCourses();
    } else {
      getallCourse();
    }

    getAllCategories();
  }, [eventCategoryId, courseName]);

  const retrieveallCourse = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/course/fetch/status-wise?status=Active&videoShow=No"
    );
    return response.data;
  };

  const searchCourses = async () => {
    if (courseName !== "") {
      const response = await axios.get(
        "http://localhost:8080/api/course/fetch/name-wise?videoShow=No&courseName=" +
          courseName
      );

      return response.data;
    } else if (eventCategoryId !== "" || eventCategoryId !== "0") {
      const response = await axios.get(
        "http://localhost:8080/api/course/fetch/category-wise?videoShow=No&categoryId=" +
          eventCategoryId
      );
      return response.data;
    }
  };

  const searchCourseByName = (e) => {
    e.preventDefault();
    setcourseName(tempcourseName);

    setTempcourseName("");
    setCourseCategoryId("");
  };

  const searchCourseByCategory = (e) => {
    e.preventDefault();
    setCourseCategoryId(tempCourseCategoryId);

    setTempCourseCategoryId("");
    setcourseName("");
  };

  return (
    <div className="container-fluid mb-2">
      <Carousel />
      <h5 className="text-color-second text-center mt-3">
        Search Courses here..!!
      </h5>

      <div className="d-flex aligns-items-center justify-content-center">
        <div className="row">
          <div className="col-auto">
            <div className="mt-3">
              <form class="row g-3">
                <div class="col-auto">
                  <input
                    type="text"
                    className="form-control"
                    id="city"
                    name="courseName"
                    onChange={(e) => setTempcourseName(e.target.value)}
                    value={tempcourseName}
                    placeholder="Search Course here..."
                  />
                </div>

                <div class="col-auto">
                  <button
                    type="submit"
                    class="btn bg-color text-color mb-3"
                    onClick={searchCourseByName}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="col">
            <div className="mt-3">
              <form class="row g-3">
                <div class="col-auto">
                  <select
                    name="tempCourseCategoryId"
                    onChange={(e) => setTempCourseCategoryId(e.target.value)}
                    className="form-control"
                    required
                  >
                    <option value="">Select Course Category</option>

                    {categories.map((category) => {
                      return (
                        <option value={category.id}> {category.name} </option>
                      );
                    })}
                  </select>
                </div>

                <div class="col-auto">
                  <button
                    type="submit"
                    class="btn bg-color text-color mb-3"
                    onClick={searchCourseByCategory}
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="col-md-12 mt-3 mb-5">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {allCourse.map((course) => {
            return <CourseCard item={course} key={course.id} />;
          })}
        </div>
      </div>
      <hr />
      <Footer />
    </div>
  );
};

export default HomePage;
