import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";

import ProtectedRoute from "./config/ProtectedRoute";
import BlogList from "./pages/BlogList";
import AddBlog from "./pages/AddBlog";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Auth />}/>
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard/blogs" element={
          <ProtectedRoute>
            <BlogList />
          </ProtectedRoute>
        }/>
        <Route path="/dashboard/add" element={
          <ProtectedRoute>
            <AddBlog />
          </ProtectedRoute>
        }/>
      </Routes>
    </div>
  )
}

export default App
