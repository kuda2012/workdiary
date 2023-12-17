import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchResults,
  getPost,
  getPostsList,
  searchJournal,
} from "../helpers/actionCreators";
import "../styles/SearchBar.css";

const AllPostsHeader = ({ setShowAllPosts }) => {
  // State to hold the search input text
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const query = useSelector((state) => state.query);

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("" || query);

  // Handler to update the search input text
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  // Handler to dispatch the search contents to the search function
  const handleSearch = () => {
    // Call the search function with the search input text
    dispatch(searchJournal(workdiaryToken, searchText));
    setShowAllPosts(false);
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
    setShowAllPosts(true);
    dispatch(clearSearchResults()); // You need to define the getPost function
    dispatch(getPostsList(workdiaryToken, 1));
  };
  // Handler to select a result item and call getPost

  return (
    <div className="row justify-content-between">
      <div className="col">
        <h5>Posts</h5>
      </div>
      <div className="col">
        <form id="search-bar-form" onSubmit={handleFormSubmit}>
          <span
            // id="reset-calendar"
            // className="ms-0 me-1 mt-0 mb-0 p-0"
            onClick={reset}
          >
            🔄
          </span>
          <input
            id="search-input"
            type="text"
            value={searchText}
            placeholder="Search entries"
            autocomplete="off"
            onChange={handleInputChange}
          />
          {/* {searchResults && (
            <div id="search-results-container">
              Date: {result.date} -{" "}
              {result.match_source === "tab_title"
                ? "tab title"
                : result.match_source}
              : {result[result.match_source]}
            </div>
          )} */}
        </form>
      </div>
    </div>
  );
};

export default AllPostsHeader;
