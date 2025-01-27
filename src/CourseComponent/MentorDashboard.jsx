import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import revenue_pic from "../images/revenue.png";
import deleted_course from "../images/deleted_course.png";
import active_course from "../images/active_course.png";
import purchases from "../images/purchases.png";

const MentorDashboard = () => {
  const mentor = JSON.parse(sessionStorage.getItem("active-mentor"));
  const mentor_jwtToken = sessionStorage.getItem("mentor-jwtToken");

  const [data, setData] = useState({
    totalActiveCourse: "",
    totalDeletedCourse: "",
    totalCoursePurchases: "",
    totalPurchaseAmount: "",
    bookings: [],
  });

  useEffect(() => {
    const getDashboardData = async () => {
      const dashboardData = await retrieveDashboardData();
      if (dashboardData) {
        setData(dashboardData);
      }
    };

    getDashboardData();
  }, []);

  const retrieveDashboardData = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/course/mentor/dashboard?mentorId=" + mentor.id
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  return (
    <div className="container-fluid mt-3 mb-5">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col ">
                    <img
                      src={active_course}
                      class="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "75px",
                      }}
                    />
                  </div>
                  <div className="col" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.totalActiveCourse}</h3>
                    <div className="text-muted">Active Course</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col ">
                    <img
                      src={deleted_course}
                      class="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "65px",
                      }}
                    />
                  </div>
                  <div className="col" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.totalDeletedCourse}</h3>
                    <div className="text-muted">Deleted Course</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col ">
                    <img
                      src={revenue_pic}
                      class="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "65px",
                      }}
                    />
                  </div>
                  <div className="col" style={{ whiteSpace: "nowrap" }}>
                    <h4>&#8377;{data.totalPurchaseAmount}/-</h4>
                    <div className="text-muted">Total Sale</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="row">
                  <div className="col ">
                    <img
                      src={purchases}
                      class="card-img-top rounded"
                      alt="img"
                      style={{
                        width: "70px",
                      }}
                    />
                  </div>
                  <div className="col" style={{ whiteSpace: "nowrap" }}>
                    <h3> {data.totalCoursePurchases}</h3>
                    <div className="text-muted">Total Purchases</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3 mb-5">
          <div className="col">
            <div className="card rounded-card shadow-lg">
              <div className="card-body">
                <div className="text-center">
                  <h4>Course Purchases</h4>
                </div>
                <div
                  style={{
                    overflowY: "auto",
                    height: "300px",
                  }}
                >
                  <div className="table-responsive mt-2">
                    <table className="table table-hover text-color text-center">
                      <thead className="table-bordered border-color bg-color custom-bg-text">
                        <tr>
                          <th scope="col">Purchase Id</th>
                          <th scope="col">Thumnail</th>
                          <th scope="col">Course Name</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Price</th>
                          <th scope="col">Purchase Time</th>
                          <th scope="col">Payment Id</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.bookings.map((booking) => {
                          return (
                            <tr>
                              <td>
                                <b>{booking.bookingId}</b>
                              </td>
                              <td>
                                <img
                                  src={
                                    "http://localhost:8080/api/course/" +
                                    booking.course.thumbnail
                                  }
                                  class="img-fluid"
                                  alt="thumbnail"
                                  style={{
                                    maxWidth: "90px",
                                  }}
                                />
                              </td>
                              <td>
                                <b>{booking.course.name}</b>
                              </td>

                              <td>
                                <b>
                                  {booking.customer.firstName +
                                    " " +
                                    booking.customer.lastName}
                                </b>
                              </td>
                              <td>
                                <b>&#8377;{booking.amount}</b>
                              </td>
                              <td>
                                <b>
                                  {formatDateFromEpoch(booking.bookingTime)}
                                </b>
                              </td>
                              <td>
                                <b>{booking.payment.paymentId}</b>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
