import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchResults,
  getPost,
  searchDiary,
  setScrollTo,
} from "../helpers/actionCreators";
import "../styles/AllPosts.css";

const SearchPostsResults = ({ closeAllPostsModal }) => {
  const dispatch = useDispatch();
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const searchResults = useSelector((state) => state.search_results);
  const pagination = useSelector((state) => state?.pagination);
  const query = useSelector((state) => state.query);

  const handlePostClick = (result) => {
    if (result) {
      // Call the getPost function with the selected date
      dispatch(getPost(workdiaryToken, result.date));
      closeAllPostsModal();
      dispatch(clearSearchResults());
      dispatch(
        setScrollTo({
          ...result,
          [result.match_source]: result.original_string,
        })
      );
    }
  };
  function getNumbersBetween(min, max) {
    return [...Array(max - min + 1)].map((_, i) => min + i);
  }

  const startIndex =
    pagination.currentPage <= 2 ? 1 : Math.max(1, pagination.currentPage - 2);
  const endIndex = Math.min(pagination.lastPage, startIndex + 3);

  return (
    <div className="container mt-2">
      <div className="row flex-column align-items-center">
        <div className="col-12">
          <ul id="posts-list">
            {searchResults &&
              searchResults.map((result) => (
                <li className="posts-list-li">
                  <a
                    className="posts-list-anchor-tags"
                    href="#"
                    onClick={() => {
                      handlePostClick(result);
                    }}
                  >
                    <b>{result.date}</b> -{" "}
                    <b>
                      {result.match_source === "tab_title"
                        ? "Tab Title: "
                        : `${
                            result.match_source.charAt(0).toUpperCase() +
                            result.match_source.slice(1)
                          }:  `}
                    </b>
                    {result[result.match_source]}
                  </a>
                </li>
              ))}
          </ul>
          {
            <button
              className="p-2"
              onClick={() => dispatch(searchDiary(workdiaryToken, query, 1))}
              disabled={pagination.currentPage <= 4}
            >
              <img
                className={`${
                  pagination.currentPage <= 4 ? "hidden" : ""
                } back-next-arrow`}
                src="back-arrow-2x.png"
              />
            </button>
          }
          {
            <button
              disabled={pagination.currentPage <= 3}
              className="p-2"
              onClick={() =>
                dispatch(
                  searchDiary(
                    workdiaryToken,
                    query,
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
          }

          {getNumbersBetween(startIndex, endIndex).map((num) => (
            <button
              className={`p-2 btn btn-${
                num === pagination.currentPage ? "primary" : "secondary"
              }`}
              key={num}
              onClick={() => dispatch(searchDiary(workdiaryToken, query, num))}
            >
              {num}
            </button>
          ))}
          {
            <button
              disabled={pagination.currentPage >= pagination.lastPage - 1}
              className="p-2"
              onClick={() =>
                dispatch(
                  searchDiary(
                    workdiaryToken,
                    query,
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
          }
          {
            <button
              disabled={pagination.currentPage >= pagination.lastPage - 1}
              className="p-2"
              onClick={() =>
                dispatch(
                  searchDiary(workdiaryToken, query, pagination.lastPage)
                )
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
          }
        </div>
      </div>
    </div>
  );
};

export default SearchPostsResults;
