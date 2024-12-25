import { useNavigate } from "react-router-dom";
import logo from "../assets/1eq-foundation-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { signOut } from "../redux/slices/authSlice";
import { useState } from "react";
import Signin from "../pages/Signin";
import { ROLE_ADMIN, ROLE_EMPLOYEE, ROLE_USER } from "../static/Variables";

interface NavbarProps {
  onRefreshClick?: () => void;
}

const Navbar = ({ onRefreshClick }: NavbarProps) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state?.auth?.user);
  const dispatch = useDispatch<AppDispatch>();
  const [isSignInOpen, setSignInOpen] = useState(false);
  const role = useSelector((state: RootState) => state?.auth?.user?.role);
  const toggleSignIn = () => setSignInOpen(!isSignInOpen);

  const handleNavigation = (path: string) => {
    if (user) {
      navigate(path);
    } else {
      setSignInOpen(true);
    }
  };

  return (
    <div className="flex justify-between items-center w-full px-10 py-4 bg-blue-800 text-white">
      <img
        src={logo}
        alt="Company Logo"
        className="cursor-pointer"
        onClick={() => navigate("/")}
      />
      {(!role || role == ROLE_USER || role == undefined) &&
        <>
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => handleNavigation("/assignword")}
          >
            Purchase Word
          </div>
          <div
            className="text-2xl font-bold cursor-pointer"
            onClick={() => handleNavigation("/purchasedwords")}
          >
            Words Purchased
          </div>
        </>
      }
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => handleNavigation("/userdistribution")}
      >
        User Distribution
      </div>
      {role == ROLE_ADMIN &&
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => handleNavigation("/chatadmindashboard")}
        >
          Admin Chat Dashboard
        </div>
      }
      {role == ROLE_EMPLOYEE &&
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => handleNavigation("/chatemployeedashboard")}
        >
          Employee Chat Dashboard
        </div>
      }
      {onRefreshClick && (
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={onRefreshClick}
        >
          Refresh
        </div>
      )}
      {user ? (
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => dispatch(signOut())}
        >
          Logout
        </div>
      ) : (
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={toggleSignIn}
        >
          Signin
        </div>
      )}
      {isSignInOpen && <Signin onClose={toggleSignIn} />}
    </div>
  );
};

export default Navbar;