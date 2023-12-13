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
          {getNumbersBetween(1, pagination.lastPage).map((num) => (
            <button
              onClick={() => {
                dispatch(getPostsList(workdiaryToken, num));
              }}
            >
              {" "}
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
