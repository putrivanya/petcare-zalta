import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import UserPage from "./components/UserPage";

// =====================================================
// PUBLIC
// =====================================================

import Home from "./pages/User/Home";
import Login from "./pages/Login/Login";
// PERBAIKAN: Mengubah "egister" menjadi "register"
import Register from "./pages/Register/register";
import TrackOrder from "./pages/TrackOrder/TrackOrder"; 

// =====================================================
// USER / PELANGGAN
// =====================================================

import Dashboard from "./pages/Dashboard/Dashboard";

import Shop from "./pages/Shop/Shop";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Cart from "./pages/Cart/Cart";
import Checkout from "./pages/Checkout/Checkout";

import Grooming from "./pages/Grooming/Grooming";
import BookingGrooming from "./pages/BookingGrooming/BookingGrooming";

import Doctor from "./pages/Doctor/Doctor";
import Hotel from "./pages/Hotel/Hotel";

import Adoption from "./pages/Adoption/Adoption";
import AdoptionForm from "./pages/Adoption/AdoptionForm";

import BookingStatus from "./pages/BookingStatus/BookingStatus";

// =====================================================
// ADMIN
// =====================================================

import DashboardAdmin from "./pages/DashboardAdmin/DashboardAdmin";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            PUBLIC
        ================================================== */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================================
            DASHBOARD PELANGGAN
        ================================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <Dashboard />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            PROFILE PELANGGAN – DIHAPUS KARENA TIDAK DIPERLUKAN
        ================================================== */}

        {/* Rute /profile telah dihapus */}


        {/* ==================================================
            SHOP
        ================================================== */}

        <Route
          path="/shop"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <Shop />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            PRODUCT DETAIL
        ================================================== */}

        <Route
          path="/product/:id"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <ProductDetail />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            CART
        ================================================== */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <Cart />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            CHECKOUT
        ================================================== */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <Checkout />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            TRACK ORDER (LACAK PESANAN) --- RUTE BARU
        ================================================== */}

        <Route
          path="/track-order/:id"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <TrackOrder />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            GROOMING
        ================================================== */}

        <Route
          path="/grooming"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <Grooming />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            BOOKING GROOMING
        ================================================== */}

        <Route
          path="/booking-grooming"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <BookingGrooming />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            DOCTOR
        ================================================== */}

        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <Doctor />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            HOTEL
        ================================================== */}

        <Route
          path="/hotel"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <Hotel />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADOPTION
        ================================================== */}

        <Route
          path="/adoption"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <Adoption />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            FORM ADOPTION
        ================================================== */}

        <Route
          path="/adoption/:id"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <AdoptionForm />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            BOOKING STATUS
        ================================================== */}

        <Route
          path="/booking-status"
          element={
            <ProtectedRoute role="pelanggan">
              <UserPage>
                <BookingStatus />
              </UserPage>
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN DASHBOARD
        ================================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN USERS
        ================================================== */}

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN PRODUCTS
        ================================================== */}

        <Route
          path="/admin/products"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN DOCTORS
        ================================================== */}

        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN GROOMING
        ================================================== */}

        <Route
          path="/admin/grooming"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN HOTEL
        ================================================== */}

        <Route
          path="/admin/hotel"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN ADOPTION
        ================================================== */}

        <Route
          path="/admin/adoption"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN BOOKING
        ================================================== */}

        <Route
          path="/admin/booking"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            ADMIN PAYMENTS
        ================================================== */}

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            FALLBACK
        ================================================== */}

        <Route
          path="*"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;