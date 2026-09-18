import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  lazy,
  Suspense,
} from "react";

import ProtectedRoute from "./components/ProtectedRoute";
import UserPage from "./components/UserPage";

// =====================================================
// LAZY LOADING PAGES
// =====================================================
// Setiap halaman dimuat hanya ketika dibutuhkan.
// Ini membantu mengurangi JavaScript awal yang harus
// di-download dan diproses browser.
// =====================================================

// -------------------------
// PUBLIC
// -------------------------

const Home = lazy(() =>
  import("./pages/User/Home")
);

const Login = lazy(() =>
  import("./pages/Login/Login")
);

const Register = lazy(() =>
  import("./pages/Register/register")
);

const TrackOrder = lazy(() =>
  import("./pages/TrackOrder/TrackOrder")
);

// -------------------------
// USER / PELANGGAN
// -------------------------

const Dashboard = lazy(() =>
  import("./pages/Dashboard/Dashboard")
);

const Shop = lazy(() =>
  import("./pages/Shop/Shop")
);

const ProductDetail = lazy(() =>
  import("./pages/ProductDetail/ProductDetail")
);

const Cart = lazy(() =>
  import("./pages/Cart/Cart")
);

const Checkout = lazy(() =>
  import("./pages/Checkout/Checkout")
);

const Grooming = lazy(() =>
  import("./pages/Grooming/Grooming")
);

const BookingGrooming = lazy(() =>
  import("./pages/BookingGrooming/BookingGrooming")
);

const Doctor = lazy(() =>
  import("./pages/Doctor/Doctor")
);

const Hotel = lazy(() =>
  import("./pages/Hotel/Hotel")
);

const Adoption = lazy(() =>
  import("./pages/Adoption/Adoption")
);

const AdoptionForm = lazy(() =>
  import("./pages/Adoption/AdoptionForm")
);

const BookingStatus = lazy(() =>
  import("./pages/BookingStatus/BookingStatus")
);

// -------------------------
// ADMIN
// -------------------------

const DashboardAdmin = lazy(() =>
  import("./pages/DashboardAdmin/DashboardAdmin")
);


// =====================================================
// LOADING COMPONENT
// =====================================================

function PageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "30px",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #2563eb",
            borderRadius: "50%",
            animation: "zalLoading 0.8s linear infinite",
            margin: "0 auto 15px",
          }}
        />

        <p
          style={{
            margin: 0,
            color: "#374151",
            fontSize: "15px",
          }}
        >
          Memuat halaman...
        </p>

        <style>
          {`
            @keyframes zalLoading {
              from {
                transform: rotate(0deg);
              }

              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  return (
    <BrowserRouter>

      <Suspense fallback={<PageLoader />}>

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
              TRACK ORDER
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

      </Suspense>

    </BrowserRouter>
  );
}

export default App;