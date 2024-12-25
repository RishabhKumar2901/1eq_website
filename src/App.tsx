import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import Home from "./pages/Home";
import UserMap from "./pages/UserMap";
import AssignWord from "./pages/AssignWord";
import PurchasedWords from "./pages/PurchasedWords";
import ChatAdminDashboard from "./pages/ChatAdminDashboard";
import ChatEmployeeDashboard from "./pages/ChatEmployeeDashboard";
import AddWordForm from "./pages/AddWordForm";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userdistribution" element={<UserMap />} />
        <Route
          path="/createword"
          element={<AddWordForm />}
        />
        <Route
          path="/assignword"
          element={<AssignWord />}
        />
        <Route
          path="/purchasedwords"
          element={<PurchasedWords />}
        />
        <Route
          path="/chatadmindashboard"
          element={<ChatAdminDashboard />}
        />
        <Route
          path="/chatemployeedashboard"
          element={<ChatEmployeeDashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
