import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Box from "@mui/material/Box";
import Navbar from "./components/Navbar";
import AuthService from "./services/auth.service";
import HomePage from "./pages/Home";
import ClientPage from "./pages/Client";
import ClientsTable from "./components/ClientsTable";

function PrivateRoute({ children }) {
  const auth = AuthService.getCurrentUser();
  return auth ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <div>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<h1>Login route</h1>} />
        </Routes>
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            paddingTop: "80px",
            paddingLeft: { md: "240px", sm: "0px" },
          }}
        >
          <Routes>
            <Route
              index
              element={
                <HomePage />
              }
            />
            <Route
              path="/clients"
              element={
                <PrivateRoute>
                  <ClientsTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/clients/:id"
              element={
                <PrivateRoute>
                  <ClientPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/applications"
              element={
                <PrivateRoute>
                  <h1>Application route</h1>
                </PrivateRoute>
              }
            />
          </Routes>
        </Box>
      </Router>
    </div>
  );
}

export default App;