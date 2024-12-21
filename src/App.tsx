import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import UserMap from "./pages/UserMap";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import AssignWord from "./pages/AssignWord";
import PurchasedWords from "./pages/PurchasedWords";

function App() {
  const user = useSelector((state: RootState) => state?.auth?.user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/signin"
          element={user ? <Navigate to="/" /> : <Signin />}
        />
        <Route path="/userdistribution" element={<UserMap />} />
        <Route
          path="/assignword"
          element={user ? <AssignWord /> : <Navigate to="/signin" />}
        />
        <Route
          path="/purchasedwords"
          element={user ? <PurchasedWords /> : <Navigate to="/signin" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
