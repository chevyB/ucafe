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
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Seller]} />}>
          <Route path="seller" element={<SellerDashboard />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  )
}

export default App
