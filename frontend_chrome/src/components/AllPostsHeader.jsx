import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchResults,
  getPostsList,
  searchJournal,
  setShowAllPosts,
} from "../helpers/actionCreators";
import "../styles/AllPosts.css";

const AllPostsHeader = () => {
  // State to hold the search input text
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const query = useSelector((state) => state.query);

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("" || query);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  // Handler to update the search input text
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  // Handler to dispatch the search contents to the search function
  const handleSearch = () => {
    // Call the search function with the search input text
    dispatch(searchJournal(workdiaryToken, searchText));
    dispatch(setShowAllPosts(false));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (searchText.trim() !== "") {
      // Check if the search text is not empty or only contains whitespace
      handleSearch();
    }
  };

  const reset = () => {
    setSearchText("");
    dispatch(setShowAllPosts(true));
    dispatch(clearSearchResults()); // You need to define the getPost function
    dispatch(getPostsList(workdiaryToken, 1));
  };
  // Handler to select a result item and call getPost

  return (
    <div className="container">
      <div className="row justify-content-between">
        <div className="col-2">
          <h5>Your Entries</h5>
        </div>
        <div className="col-10 d-flex justify-content-end">
          <form onSubmit={handleFormSubmit}>
            <span
              // id="reset-calendar"
              className="me-1"
              onClick={reset}
              for="all-posts-search"
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
              placeholder={showPlaceholder && "Search all entries, tabs, or tags"}
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
