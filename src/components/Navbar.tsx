import { useNavigate } from "react-router-dom";
import logo from "../assets/1eq-foundation-logo.png";

const Navbar = ({ onRefreshClick }: { onRefreshClick: () => void }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center w-full px-10 py-4 bg-blue-800 text-white">
      <img src={logo} alt="Company Logo" />
      <div className="text-2xl font-bold cursor-pointer">Scholarships</div>
      <div className="text-2xl font-bold cursor-pointer">SSC</div>
      <div className="text-2xl font-bold cursor-pointer">Vocab</div>
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => onRefreshClick()}
      >
        Refresh
      </div>
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/signin")}
      >
        Signin
      </div>
      <div
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/mapdata")}
      >
        User Distribution
      </div>
    </div>
  );
};

export default Navbar;
