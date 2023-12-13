import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getPost, getPostsList } from "../helpers/actionCreators";
// import "../styles/AllPosts.css";

const AllPosts = ({ closeAllPostsModal }) => {
  const dispatch = useDispatch();
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const postsList = useSelector((state) => state?.posts_list);
  const pagination = useSelector((state) => state?.pagination);

  console.log(postsList, pagination);

  const handlePostClick = (date) => {
    if (date) {
      // Call the getPost function with the selected date
      dispatch(getPost(workdiaryToken, moment(date).format("MM/DD/YYYY")));
      closeAllPostsModal();
    }
  };
  function getNumbersBetween(min, max) {
    return [...Array(max - min + 1)].map((_, i) => min + i);
  }

  const startIndex =
    pagination.currentPage <= 4 ? 1 : Math.max(1, pagination.currentPage - 2);
  const endIndex = Math.min(pagination.lastPage, startIndex + 4);

  return (
    <div className="container">
      <h3>Posts</h3>
      <div className="row flex-column align-items-center">
        <div className="col-12">
          <ul>
            {postsList.map((post) => (
              <li>
                <a
                  href="#"
                  onClick={() => {
                    handlePostClick(post.date);
                  }}
                >
                  {moment(post.date).format("MM/DD/YYYY")} - {post.summary_text}
                </a>
              </li>
            ))}
          </ul>
          {pagination.currentPage - 5 >= 1 && (
            <button onClick={() => dispatch(getPostsList(workdiaryToken, 1))}>
              {"<<"}
            </button>
          )}
          {pagination.currentPage > 2 && (
            <button
              onClick={() =>
                dispatch(
                  getPostsList(
                    workdiaryToken,
                    Math.max(1, pagination.currentPage - 5)
                  )
                )
              }
            >
              {"<"}
            </button>
          )}

          {getNumbersBetween(startIndex, endIndex).map((num) => (
            <button
              className={`btn btn-${
                num === pagination.currentPage ? "primary" : "secondary"
              }`}
              key={num}
              onClick={() => dispatch(getPostsList(workdiaryToken, num))}
            >
              {num}
            </button>
          ))}
          {pagination.currentPage < pagination.lastPage - 4 && (
            <button
              onClick={() =>
                dispatch(
                  getPostsList(workdiaryToken, pagination.currentPage + 5)
                )
              }
            >
              {">"}
            </button>
          )}
          {pagination.currentPage < pagination.lastPage - 2 && (
            <button
              onClick={() =>
                dispatch(getPostsList(workdiaryToken, pagination.lastPage))
              }
            >
              {">>"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
