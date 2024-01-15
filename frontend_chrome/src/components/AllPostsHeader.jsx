import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchResults,
  getPostsList,
  searchJournal,
  setShowAllPosts,
} from "../helpers/actionCreators";
import "../styles/AllPosts.css";

const AllPostsHeader = () => {
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const searchResults = useSelector((state) => state.search_results);
  const query = useSelector((state) => state.query);
  const [searchText, setSearchText] = useState(query);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const dispatch = useDispatch();

  // Handler to update the search input text
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  // Handler to dispatch the search contents to the search function
  const handleSearch = () => {
    dispatch(searchJournal(workdiaryToken, searchText));
    dispatch(setShowAllPosts(false));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (searchText.trim() !== "") {
      handleSearch();
    }
  };

  const reset = () => {
    if (searchResults) {
      setSearchText("");
      dispatch(setShowAllPosts(true));
      dispatch(clearSearchResults());
      dispatch(getPostsList(workdiaryToken, 1));
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-between">
        <div className="col-2">
          <h5>Your Entries</h5>
        </div>
        <div className="col-10 d-flex justify-content-end">
          <form name="search-posts-form" onSubmit={handleFormSubmit}>
            <span
              className="me-1"
              onClick={reset}
              for="all-posts-search"
              id="all-posts-search-reset"
            >
              🔄
            </span>
            <input
              id="all-posts-search"
              type="text"
              value={searchText}
              onFocus={() => {
                setShowPlaceholder(false);
              }}
              onBlur={() => {
                setShowPlaceholder(true);
              }}
              placeholder={
                showPlaceholder && "Search all entries, tabs, or tags"
              }
              autocomplete="off"
              onChange={handleInputChange}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AllPostsHeader;
