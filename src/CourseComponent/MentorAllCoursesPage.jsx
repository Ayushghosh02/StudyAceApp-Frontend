import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CourseCard from "./CourseCard";

const MentorAllCoursesPage = () => {
  const { mentorId } = useParams();

  const navigate = useNavigate();

  const [allCourse, setallCourse] = useState([]);

  const [user, setUser] = useState({
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
  });

  useEffect(() => {
    const getallCourseByMentor = async () => {
      const allCourse = await retrieveallCourse();
      if (allCourse) {
        setallCourse(allCourse.courses);
      }
    };

    const getUser = async () => {
      const userRes = await retrieveUser();
      if (userRes) {
        setUser(userRes.users[0]);
      }
    };

    getUser();
    getallCourseByMentor();
  }, [mentorId]);

  const retrieveallCourse = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/course/fetch/mentor-wise?status=Active&videoShow=No&mentorId=" +
        mentorId
    );
    return response.data;
  };

  const retrieveUser = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/user/fetch/user-id?userId=" + mentorId
    );
    return response.data;
  };

  return (
    <div className="container-fluid mb-2">
      <div className="container-fluid mb-2">
        <div className="d-flex align-items-center justify-content-center ms-5 mt-1 me-5 mb-3">
          <div
            className="h-100"
            style={{
              width: "900px",
            }}
          >
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-center">
                <img
                  src={
                    "http://localhost:8080/api/user/" +
                    user.mentorDetail.profilePic
                  }
                  className="card-img-top mentor-profile-photo mt-3 rounded-circle"
                  alt="profile_pic"
                />
              </div>

              <div className="row mt-4">
                <div className="col-md-4">
                  <p className="mb-2">
                    <b>First Name:</b> {user.firstName}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mb-2">
                    <b>Last Name:</b> {user.lastName}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mb-2">
                    <b>Age:</b> {user.mentorDetail.age}
                  </p>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4">
                  <p className="mb-2">
                    <b>Profession:</b> {user.mentorDetail.profession}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mb-2">
                    <b>Qualification:</b>{" "}
                    {user.mentorDetail.highestQualification}
                  </p>
                </div>
                <div className="col-md-4">
                  <p className="mb-2">
                    <b>Experience:</b> {user.mentorDetail.experience}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
        <hr />
      </div>

      <div className="col-md-12 mt-3 mb-5">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {allCourse.map((course) => {
            return <CourseCard item={course} key={course.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default MentorAllCoursesPage;
