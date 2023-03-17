import { Routes, Route } from "react-router-dom"
import { ROLES } from "./configs/config"
import Home from "./pages/Home"
import Register from "./pages/auth/Register"
import Login from "./pages/auth/Login"
import Logout from "./pages/auth/Logout"
import Layout from "./pages/common/Layout"
import AdminDashboard from "./pages/admin/Dashboard"
import Missing from "./pages/common/Missing"
import Unauthorized from "./pages/common/Unauthorized"
import RequireAuth from "./pages/common/RequireAuth"
import SellerDashboard from "./pages/seller/Dashboard"
import AddProduct from "./pages/seller/AddProduct"
import EditProduct from "./pages/seller/EditProduct"
import Store from "./pages/user/Store"
import Cart from "./pages/user/Cart"
import UserOrders from "./pages/user/UserOrders"
import SellerOrders from "./pages/seller/SellerOrders"
import SellerOrderDetail from "./pages/seller/SellerOrderDetail"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="logout" element={<Logout />} />
        <Route path="unauthorized" element={<Unauthorized />} />

        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<UserOrders />} />
          <Route path="/store/:storeId" element={<Store />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/:type" element={<AdminDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Seller]} />}>
          <Route path="seller" element={<SellerDashboard />} />
          <Route path="seller/product/add" element={<AddProduct />} />
          <Route path="seller/product/:productId" element={<EditProduct />} />
          <Route path="seller/orders" element={<SellerOrders />} />
          <Route path="seller/order/:orderId" element={<SellerOrderDetail />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
