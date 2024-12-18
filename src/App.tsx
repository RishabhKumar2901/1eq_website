import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import UserMap from "./pages/UserMap";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home /> } />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/mapdata" element={<UserMap />} />
      </Routes>
    </Router>
  );
}

export default App;
