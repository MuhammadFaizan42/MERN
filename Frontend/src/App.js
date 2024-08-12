import React, { useContext, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/pages/Home.jsx";
import About from "./components/pages/About.jsx";
import Blogs from "./components/pages/Blogs.jsx";
import SingleBlog from "./components/pages/SingleBlog.jsx";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import { Toaster } from "react-hot-toast";
import Dashboard from "./components/pages/Dashboard.jsx";
import Register from "./components/pages/Register.jsx";
import Login from "./components/pages/Login.jsx";
import AllAuthors from "./components/pages/AllAuthors.jsx";
import axios from "axios";
import { Context } from "./index.js";
import UpdateBlog from "./components/pages/UpdateBlog.jsx";

const App = () => {
  const { setUser, isAuthenticated, setIsAuthenticated, user, setBlogs } = useContext(Context);
  
  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const {data} = await axios.get(
          "https://mern-pq6d.vercel.app/api/myprofile",
          {
            withCredentials: true,
          }
        );
        setUser(data.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          "https://mern-pq6d.vercel.app/api/allblogs",
          { withCredentials: true }
        );
        setBlogs(data.allBlog);
      } catch (error) {
        setBlogs([]);
      }
    };
    
      fetchUser();
      fetchBlogs();
  },[isAuthenticated,user]);
  return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<SingleBlog />} />
          <Route path="/about" element={<About />} />
          <Route path="/authors" element={<AllAuthors />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/update/:id" element={<UpdateBlog />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
  );
};

export default App;
