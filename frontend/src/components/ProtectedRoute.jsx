import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // =====================================================
  // BELUM LOGIN
  // =====================================================

  if (!token || !userData) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =====================================================
  // BACA DATA USER
  // =====================================================

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    console.error("Data user rusak:", error);

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // DATA USER TIDAK VALID
  // =====================================================

  if (!user || typeof user !== "object") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // AMBIL ROLE
  // =====================================================

  const userRole = String(
    user.role ||
    user.Role ||
    user.user_role ||
    user.userRole ||
    ""
  )
    .trim()
    .toLowerCase();

  // =====================================================
  // ROLE TIDAK ADA
  // =====================================================

  if (!userRole) {
    console.error(
      "Role user tidak ditemukan:",
      user
    );

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // ROLE YANG DIANGGAP ADMIN
  // =====================================================

  const adminRoles = [
    "admin",
    "administrator",
  ];

  const isAdmin =
    adminRoles.includes(userRole);

  // =====================================================
  // ROLE YANG DIANGGAP USER / CLIENT
  // =====================================================

  const userRoles = [
    "user",
    "client",
    "customer",
    "pengguna",
  ];

  const isUser =
    userRoles.includes(userRole);

  // =====================================================
  // ROUTE ADMIN
  // =====================================================

  if (role === "admin") {

    if (isAdmin) {
      return children;
    }

    if (isUser) {
      return (
        <Navigate
          to="/dashboard"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // ROUTE USER
  // =====================================================

  if (role === "user") {

    if (isUser) {
      return children;
    }

    if (isAdmin) {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // JIKA TIDAK ADA ROLE YANG DIMINTA
  // =====================================================

  return children;
}

export default ProtectedRoute;