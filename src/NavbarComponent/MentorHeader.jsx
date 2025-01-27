import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MentorHeader = () => {
  let navigate = useNavigate();

  const user = JSON.parse(sessionStorage.getItem("active-mentor"));

  const mentorLogout = () => {
    toast.success("logged out!!!", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    sessionStorage.removeItem("active-mentor");
    sessionStorage.removeItem("mentor-jwtToken");
    setTimeout(() => {
      navigate("/home");
      window.location.reload(true);
    }, 2000); // Redirect after 3 seconds
  };
  return (
    <ul class="navbar-nav ms-auto mb-2 mb-lg-0 me-5">
      <li class="nav-item">
        <Link
          to="/mentor/dashboard"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Dashboard</b>
        </Link>
      </li>
      <li class="nav-item dropdown">
        <a
          class="nav-link dropdown-toggle text-color"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <b> My Course</b>
        </a>
        <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
          <li>
            <Link
              to="/mentor/course/add"
              class="nav-link active"
              aria-current="page"
            >
              <b className="text-color">Add Course</b>
            </Link>
          </li>
          <li>
            <Link
              to="/mentor/course/all"
              class="nav-link active"
              aria-current="page"
            >
              <b className="text-color">View Course</b>
            </Link>
          </li>
        </ul>
      </li>

      <li class="nav-item">
        <Link
          to="/mentor/course/customer/purchases"
          class="nav-link active"
          aria-current="page"
        >
          <b className="text-color">Purchased Courses</b>
        </Link>
      </li>

      <li class="nav-item">
        <Link to="/mentor/profile" class="nav-link active" aria-current="page">
          <b className="text-color">Profile</b>
        </Link>
      </li>
      <li class="nav-item">
        <Link
          to=""
          class="nav-link active"
          aria-current="page"
          onClick={mentorLogout}
        >
          <b className="text-color">Logout</b>
        </Link>
        <ToastContainer />
      </li>
    </ul>
  );
};

export default MentorHeader;
