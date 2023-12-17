import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { getPost, getPostsList } from "../helpers/actionCreators";
import "../styles/AllPosts.css";

const AllPosts = ({ closeAllPostsModal }) => {
  const dispatch = useDispatch();
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const postsList = useSelector((state) => state?.posts_list);
  const pagination = useSelector((state) => state?.pagination);

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
    pagination.currentPage <= 2 ? 1 : Math.max(1, pagination.currentPage - 2);
  const endIndex = Math.min(pagination.lastPage, startIndex + 3);
  return (
    <div className="container">
      <div className="row flex-column align-items-center">
        <div className="col-12">
          <ul id="all-posts-list">
            {postsList &&
              postsList.map((post) => (
                <li>
                  <a
                    href="#"
                    onClick={() => {
                      handlePostClick(post.date);
                    }}
                  >
                    {moment(post.date).format("MM/DD/YYYY")} -{" "}
                    {post.entry ? (
                      `${post.entry}`
                    ) : (
                      <i>*Has only tags and/or tabs*</i>
                    )}
                  </a>
                </li>
              ))}
          </ul>
          {
            <button
              className="p-2"
              onClick={() => dispatch(getPostsList(workdiaryToken, 1))}
              disabled={!(pagination.currentPage > 4)}
            >
              <img
                className={`${
                  !(pagination.currentPage > 4) ? "hidden" : ""
                } back-next-arrow`}
                src="back-arrow-2x.png"
              />
            </button>
          }
          {
            <button
              disabled={!(pagination.currentPage > 2)}
              className="p-2"
              onClick={() =>
                dispatch(
                  getPostsList(
                    workdiaryToken,
                    Math.max(1, pagination.currentPage - 4)
                  )
                )
              }
            >
              <img
                className={`${
                  !(pagination.currentPage > 2) ? "hidden" : ""
                } back-next-arrow`}
                src="back-arrow.png"
              />
            </button>
          }

          {getNumbersBetween(startIndex, endIndex).map((num) => (
            <button
              className={`p-2 btn btn-${
                num === pagination.currentPage ? "primary" : "secondary"
              }`}
              key={num}
              onClick={() => dispatch(getPostsList(workdiaryToken, num))}
            >
              {num}
            </button>
          ))}
          {
            <button
              disabled={!(pagination.currentPage < pagination.lastPage - 2)}
              className="p-2"
              onClick={() =>
                dispatch(
                  getPostsList(workdiaryToken, pagination.currentPage + 4)
                )
              }
            >
              <img
                className={`${
                  !(pagination.currentPage < pagination.lastPage - 2)
                    ? "hidden"
                    : ""
                } back-next-arrow`}
                src="next-arrow.png"
              />
            </button>
          }
          {
            <button
              disabled={!(pagination.currentPage < pagination.lastPage)}
              className="p-2"
              onClick={() =>
                dispatch(getPostsList(workdiaryToken, pagination.lastPage))
              }
            >
              <img
                className={`${
                  !(pagination.currentPage < pagination.lastPage)
                    ? "hidden"
                    : ""
                } back-next-arrow`}
                src="next-arrow-2x.png"
              />
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
