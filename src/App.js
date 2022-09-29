import { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import AuthRoute from "./pages/AuthRoute";
import HomeRoute from "./pages/HomeRoute";
import ShareRoute from "./pages/ShareRoute";

import "./App.css";
import "./pages/style.css";

const App = () => {
  // Check auth status
  const [isAuth, setIsAuth] = useState(false);
  const getAuth = localStorage.getItem("auth");

  useEffect(() => {
    if (getAuth) {
      setAuthTrue();
    }
  }, []);

  const setAuthTrue = () => {
    setIsAuth(true);
  };

  const setAuthFalse = () => {
    localStorage.removeItem("auth");
    setIsAuth(false);
  };

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/home" /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={
            !isAuth ? (
              <AuthRoute setAuthTrue={setAuthTrue} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/home"
          element={
            isAuth ? (
              <HomeRoute setAuthFalse={setAuthFalse} userId={getAuth} />
            ) : (
              <Navigate to="/auth" />
            )
          }
        />
        <Route path="/share" element={<ShareRoute />} />
      </Routes>
    </div>
  );
};

export default App;
