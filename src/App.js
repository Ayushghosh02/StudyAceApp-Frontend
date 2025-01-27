import { Routes, Route } from "react-router-dom";
import Header from "./NavbarComponent/Header";
import AdminRegisterForm from "./UserComponent/AdminRegisterForm";
import UserLoginForm from "./UserComponent/UserLoginForm";
import UserRegister from "./UserComponent/UserRegister";
import HomePage from "./PageComponent/HomePage";
import AddCategoryForm from "./CategoryComponent/AddCategoryForm";
import ViewAllCategories from "./CategoryComponent/ViewAllCategories";
import UpdateCategoryForm from "./CategoryComponent/UpdateCategoryForm";
import ViewAllCustomers from "./UserComponent/ViewAllCustomers";
import ViewAllMentor from "./UserComponent/ViewAllMentor";
import CourseDetailPage from "./CourseComponent/CourseDetailPage";
import PurchasedCourseDetail from "./CourseComponent/PurchasedCourseDetail";
import MentorAllCoursesPage from "./CourseComponent/MentorAllCoursesPage";
import AddCourseForm from "./CourseComponent/AddCourseForm";
import AddCourseSectionForm from "./CourseComponent/AddCourseSectionForm";
import ViewMentorCourses from "./CourseComponent/ViewMentorCourses";
import CourseBookingPage from "./CourseBookingComponent/CourseBookingPage";
import ViewCustomerCourse from "./CourseBookingComponent/ViewCustomerCourse";
import ViewMentorCoursePurchases from "./CourseBookingComponent/ViewMentorCoursePurchases";
import ViewAllCoursePurchases from "./CourseBookingComponent/ViewAllCoursePurchases";
import MentorDashboard from "./CourseComponent/MentorDashboard";
import MentorProfile from "./UserComponent/MentorProfile";
import AddProfile from "./UserComponent/AddProfile";
import ChatGemini from "./UserComponent/ChatGemini";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/user/admin/register" element={<AdminRegisterForm />} />
        <Route path="/user/login" element={<UserLoginForm />} />
        <Route path="/user/customer/register" element={<UserRegister />} />
        <Route path="/user/mentor/register" element={<UserRegister />} />
        <Route
          path="/admin/course/category/add"
          element={<AddCategoryForm />}
        />
        <Route
          path="/admin/course/category/all"
          element={<ViewAllCategories />}
        />
        <Route
          path="/admin/course/category/update"
          element={<UpdateCategoryForm />}
        />
        <Route path="/admin/customer/all" element={<ViewAllCustomers />} />

        <Route path="/admin/mentor/all" element={<ViewAllMentor />} />
        <Route path="/course/:courseId/detail" element={<CourseDetailPage />} />
        <Route
          path="/course/:courseId/videos"
          element={<PurchasedCourseDetail />}
        />
        <Route
          path="/mentor/:mentorId/course/all"
          element={<MentorAllCoursesPage />}
        />
        <Route path="/mentor/course/add" element={<AddCourseForm />} />
        <Route
          path="/mentor/course/section/add"
          element={<AddCourseSectionForm />}
        />
        <Route path="/mentor/course/all" element={<ViewMentorCourses />} />
        <Route
          path="/course/:courseId/payment/page"
          element={<CourseBookingPage />}
        />
        <Route
          path="/customer/course/purchases"
          element={<ViewCustomerCourse />}
        />
        <Route
          path="/customer/chatbot"
          element={<ChatGemini />}
        />
        <Route
          path="/mentor/course/customer/purchases"
          element={<ViewMentorCoursePurchases />}
        />
        <Route
          path="/admin/mentor/course/purchases/all"
          element={<ViewAllCoursePurchases />}
        />
        <Route path="/mentor/dashboard" element={<MentorDashboard />} />

        <Route path="/mentor/profile" element={<MentorProfile />} />
        <Route path="/mentor/profile/add" element={<AddProfile />} />
      </Routes>
    </div>
  );
}

export default App;
