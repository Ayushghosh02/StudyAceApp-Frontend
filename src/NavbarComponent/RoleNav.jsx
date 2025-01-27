import AdminHeader from "./AdminHeader";
import HeaderCustomer from "./HeaderCustomer";
import MentorHeader from "./MentorHeader";
import NormalHeader from "./NormalHeader";

const RoleNav = () => {
  const customer = JSON.parse(sessionStorage.getItem("active-customer"));
  const admin = JSON.parse(sessionStorage.getItem("active-admin"));
  const mentor = JSON.parse(sessionStorage.getItem("active-mentor"));

  if (customer != null) {
    return <HeaderCustomer />;
  } else if (admin != null) {
    return <AdminHeader />;
  } else if (mentor != null) {
    return <MentorHeader />;
  } else {
    return <NormalHeader />;
  }
};

export default RoleNav;
