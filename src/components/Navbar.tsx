import { useNavigate } from "react-router-dom";
import logo from "../assets/1eq-foundation-logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { signOut } from "../redux/slices/authSlice";

interface NavbarProps {
  onRefreshClick?: () => void;
}

const Navbar = ({ onRefreshClick }: NavbarProps) => {
  const navigate = useNavigate();
  const authState = useSelector((state: RootState) => state?.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex justify-between items-center w-full px-10 py-4 bg-blue-800 text-white">
      <img src={logo} alt="Company Logo" className="cursor-pointer" onClick={() => navigate("/")}/>
      {/* <div className="text-2xl font-bold cursor-pointer">Scholarships</div>
      <div className="text-2xl font-bold cursor-pointer">SSC</div>
      <div className="text-2xl font-bold cursor-pointer">Vocab</div> */}
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/assignword")}
      >
        Purchase Word
      </div>
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/purchasedwords")}
      >
        Words Purchased
      </div>
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/userdistribution")}
      >
        User Distribution
      </div>
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/chatadmindashboard")}
      >
        Chat Admin Dashboard
      </div>
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/chatemployeedashboard")}
      >
        Chat Employee Dashboard
      </div>
      {onRefreshClick && (
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={onRefreshClick}
        >
          Refresh
        </div>
      )}
      {authState?.user ? (
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => dispatch(signOut())}
        >
          Logout
        </div>
      ) : (
        <div
          className="text-2xl font-bold cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Signin
        </div>
      )}
    </div>
  );
};

export default Navbar;
