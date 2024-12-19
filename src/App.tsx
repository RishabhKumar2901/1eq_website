import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import UserMap from "./pages/UserMap";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";

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
        <Route path="/mapdata" element={<UserMap />} />
      </Routes>
    </Router>
  );
}

export default App;
