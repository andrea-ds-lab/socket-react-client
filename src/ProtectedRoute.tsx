// src/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./app/store";
import { PATH_LOGIN } from "./config";

interface ProtectedRouteProps {
  element: JSX.Element;
}

// A component to check if the user is authenticated before rendering a route
function ProtectedRoute({ element }: ProtectedRouteProps) {
  const isAuthenticated = useSelector(
    (state: RootState) => state.account.isAuthenticated
  );

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to the login page
    return <Navigate to={PATH_LOGIN} replace />;
  }

  // If authenticated, render the requested component
  return element;
}

export default ProtectedRoute;
