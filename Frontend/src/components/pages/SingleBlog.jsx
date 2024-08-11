import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../index";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";

const SingleBlog = () => {
  const { mode, user, isAuthenticated } = useContext(Context);
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4000/api/singleblog/${id}`,
          { withCredentials: true }
        );
        setBlog(data.blog);
      } catch (error) {
        setBlog({});
        console.log(error);
      }
    };
    getSingleBlog();
  }, []);
  if (!isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <article
      className={mode === "dark" ? "dark-bg singleBlog" : "light-bg singleBlog"}
    >
      {blog && (
        <section className="container">
          <div className="category">{blog.category}</div>
          <h1>{blog.title}</h1>
          <div className="writer_section">
            <div className="author">
              <img src={blog.authorAvatar} alt="author_avatar" />
              <p>{blog.authorName}</p>
            </div>
          </div>
          {blog && blog.mainImage && (
            <img
              src={blog.mainImage.url}
              alt="mainBlogImg"
              className="mainImg"
            />
          )}
          <p className="intro-text">{blog.intro}</p>
          <div className="sub-para">
            <h3>{blog.paraOneTitle}</h3>
            {blog && blog.paraOneImage && (
              <img src={blog.paraOneImage.url} alt="paraOneImg" />
            )}
            <p>{blog.paraOneDescription}</p>
          </div>
        </section>
      )}
    </article>
  );
};

export default SingleBlog;