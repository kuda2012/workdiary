import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import {
  getPost,
  getPostsList,
  multiDeletePosts,
} from "../helpers/actionCreators";
import "../styles/AllPosts.css";

const AllPosts = ({ closeAllPostsModal }) => {
  const dispatch = useDispatch();
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const postsList = useSelector((state) => state?.posts_list);
  const pagination = useSelector((state) => state?.pagination);
  const isChronological = useSelector((state) => state?.is_chronological);
  const date = useSelector((state) => state.date);
  const [allBoxesSelected, setAllBoxesSelected] = useState(false);
  const [postsSelected, setPostsSelected] = useState(new Set());
  const handlePostClick = (date) => {
    if (date) {
      dispatch(getPost(workdiaryToken, moment.utc(date).format("MM/DD/YYYY")));
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
      <div className="row">
        <div className="col-12">
          <ul id="posts-list">
            <div className="row mb-1">
              <div className="col d-flex justify-content-center">
                <button
                  className="btn btn-secondary p-1"
                  id="posts-date-order-button"
                  onClick={() =>
                    dispatch(
                      getPostsList(
                        workdiaryToken,
                        1,
                        isChronological ? false : true
                      )
                    )
                  }
                >
                  {/* {isChronological ? `Date order 🔼` : "Date order 🔽"} */}
                  {isChronological ? (
                    <>
                      Date order <FontAwesomeIcon icon={faCaretUp} />
                    </>
                  ) : (
                    <>
                      Date order <FontAwesomeIcon icon={faCaretDown} />
                    </>
                  )}
                </button>
              </div>
            </div>
            {postsList &&
              postsList.map((post) => (
                <li className="posts-list-li">
                  <input
                    className="posts-checkbox me-2 ms-1 form-check-input"
                    type="checkbox"
                    name="select-all-posts-input"
                    checked={postsSelected.has(post.date)}
                    onChange={() => {
                      if (postsSelected.has(post.date)) {
                        setAllBoxesSelected(false);
                        setPostsSelected((postsSelected) => {
                          postsSelected.delete(post.date);
                          return new Set(postsSelected);
                        });
                      } else {
                        setPostsSelected((postsSelected) => {
                          postsSelected.add(post.date);
                          return new Set(postsSelected);
                        });
                      }
                    }}
                  />
                  <a
                    href="#"
                    className="posts-list-anchor-tags"
                    onClick={() => {
                      handlePostClick(post.date);
                    }}
                  >
                    <b>
                      {moment
                        .utc(post.date, moment.ISO_8601)
                        .format("MM/DD/YYYY")}
                    </b>{" "}
                    -{" "}
                    {post.entry ? (
                      <>
                        <b>Entry: </b>
                        <span>{post.entry}</span>
                      </>
                    ) : (
                      <i id="has-only-tabs-or-tags">
                        *Has only tabs and/or tags*
                      </i>
                    )}
                  </a>
                </li>
              ))}
            <div className="row justify-content-start">
              <div className="col-8">
                {postsList && (
                  <>
                    <div className="mt-2">
                      <input
                        id="select-all-posts-input"
                        className="posts-checkbox me-2 ms-1 form-check-input"
                        type="checkbox"
                        checked={allBoxesSelected}
                        onChange={() => {
                          if (!postsList || postsList?.length === 0) return;
                          setAllBoxesSelected(!allBoxesSelected);
                          if (allBoxesSelected) {
                            setPostsSelected(new Set());
                          } else if (postsList?.length !== postsSelected.size) {
                            setPostsSelected((selectingAllPosts) => {
                              postsList.map((addPost) => {
                                selectingAllPosts.add(addPost.date);
                              });
                              return new Set(selectingAllPosts);
                            });
                          }
                        }}
                      />
                      <label
                        id="select-all-posts-label"
                        for="select-all-posts-input"
                      >
                        <span className="ms-2">
                          Select all (this page only)
                        </span>
                      </label>
                    </div>{" "}
                    <button
                      className="btn btn-primary mt-2 p-2"
                      onClick={() => {
                        if (postsSelected.size > 0) {
                          dispatch(
                            multiDeletePosts(
                              workdiaryToken,
                              Array.from(postsSelected),
                              date,
                              isChronological
                            )
                          );
                          setPostsSelected(new Set());
                          setAllBoxesSelected(false);
                        }
                      }}
                    >
                      Delete Selected
                    </button>
                  </>
                )}
              </div>
            </div>
          </ul>
        </div>
        <div>
          <button
            className="p-2"
            onClick={() => dispatch(getPostsList(workdiaryToken, 1))}
            disabled={pagination.currentPage <= 4}
          >
            <img
              className={`${
                pagination.currentPage <= 4 ? "hidden" : ""
              } back-next-arrow`}
              src="back-arrow-2x.png"
            />
          </button>
          <button
            disabled={pagination.currentPage <= 3}
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
                pagination.currentPage <= 3 ? "hidden" : ""
              } back-next-arrow`}
              src="back-arrow.png"
            />
          </button>
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
          <button
            disabled={pagination.currentPage >= pagination.lastPage - 1}
            className="p-2"
            onClick={() =>
              dispatch(
                getPostsList(
                  workdiaryToken,
                  Math.min(pagination.currentPage + 4, pagination.lastPage)
                )
              )
            }
          >
            <img
              className={`${
                pagination.currentPage >= pagination.lastPage - 1
                  ? "hidden"
                  : ""
              } back-next-arrow`}
              src="next-arrow.png"
            />
          </button>
          <button
            disabled={pagination.currentPage >= pagination.lastPage - 1}
            className="p-2"
            onClick={() =>
              dispatch(getPostsList(workdiaryToken, pagination.lastPage))
            }
          >
            <img
              className={`${
                pagination.currentPage >= pagination.lastPage - 1
                  ? "hidden"
                  : ""
              } back-next-arrow`}
              src="next-arrow-2x.png"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AllPosts;
