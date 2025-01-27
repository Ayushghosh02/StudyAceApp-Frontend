import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import videoIcon from "../images/video.png";
import creditcard from "../images/credit-card.png";

const CourseBookingPage = () => {
  const { courseId } = useParams();

  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const customer_jwtToken = sessionStorage.getItem("customer-jwtToken");

  const navigate = useNavigate();

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

  const [paymentRequest, setPaymentRequest] = useState({
    courseId: courseId,
    customerId: customer.id,
    cardNo: "",
    nameOnCard: "",
    amount: "",
    cvv: "",
    expiryDate: "",
  });

  const handleUserInput = (e) => {
    setPaymentRequest({
      ...paymentRequest,
      [e.target.name]: e.target.value,
    });
  };

  const payAndConfirmBooking = (e) => {
    paymentRequest.amount = calculateFeeAfterDiscount(
      course.discountInPercent,
      course.fee
    );
    fetch("http://localhost:8080/api/course/booking/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentRequest),
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

            setTimeout(() => {
              navigate(`/course/${course.id}/detail`);
            }, 2000); // Redirect after 3 seconds
          } else {
            toast.error(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
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
      });
    e.preventDefault();
  };

  useEffect(() => {
    const getCourse = async () => {
      const fetchCourseResonse = await retrieveCourse();
      if (fetchCourseResonse) {
        setCourse(fetchCourseResonse.course);
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

  function calculateFeeAfterDiscount(discountInPercent, fee) {
    // Calculate the discounted fee
    let discountedFee = fee - (fee * discountInPercent) / 100;

    // Format the discounted fee to two decimal places
    let feeAfterDiscount = discountedFee.toFixed(2);

    // Return the formatted string
    return feeAfterDiscount;
  }

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

  return (
    <div className="mt-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-6 ms-5 mb-5">
            <h4> Purchase Course From here!!!</h4>
            <div className="text-color-second text-center">
              <div className="row mt-4">
                <div class="col-sm-5 mt-2">
                  <img
                    src={creditcard}
                    className="card-img-top rounded img-fluid"
                    alt="img"
                    style={{
                      maxWidth: "300px",
                    }}
                  />
                </div>
                <div class="col-sm-6 mt-2">
                  <form className="row g-3" onSubmit={payAndConfirmBooking}>
                    <div className="text-color">
                      <input
                        type="text"
                        className="form-control"
                        id="nameOnCard"
                        name="nameOnCard"
                        onChange={handleUserInput}
                        value={paymentRequest.nameOnCard}
                        placeholder="Name on Card..."
                        required
                      />
                    </div>
                    <div className="mb-3 text-color">
                      <input
                        type="number"
                        className="form-control"
                        id="cardNo"
                        name="cardNo"
                        onChange={handleUserInput}
                        value={paymentRequest.cardNo}
                        placeholder="Enter Card Number here..."
                        required
                      />
                    </div>

                    <div className="col text-color">
                      <input
                        type="text"
                        className="form-control"
                        id="expiryDate"
                        name="expiryDate"
                        onChange={handleUserInput}
                        value={paymentRequest.expiryDate}
                        placeholder="Valid Through"
                        required
                      />
                    </div>

                    <div className="col text-color">
                      <input
                        type="number"
                        className="form-control"
                        id="cvv"
                        name="cvv"
                        onChange={handleUserInput}
                        value={paymentRequest.cvv}
                        placeholder="CVV"
                        required
                      />
                    </div>

                    <input
                      type="submit"
                      className="btn bg-color custom-bg-text ms-2"
                      value={`Pay ₹ ${calculateFeeAfterDiscount(
                        course.discountInPercent,
                        course.fee
                      )}`}
                    />
                    <ToastContainer />
                  </form>
                </div>
              </div>
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

export default CourseBookingPage;
