import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import {
  clearSearchResults,
  getPostsList,
  searchDiary,
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
    dispatch(searchDiary(workdiaryToken, searchText));
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
      dispatch(clearSearchResults());
      dispatch(getPostsList(workdiaryToken, 1));
    }
  };

  const popoverContent = (
    <Popover id="popover-content-all-posts-search" className="text-center">
      Search for anything in your diary. Words. Tabs. Tags. Anything.
    </Popover>
  );

  return (
    <div className="container">
      <div className="row justify-content-between">
        <div className="col-2">
          {searchResults ? <h5>Your Everything</h5> : <h5>Your Entries</h5>}
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
          <OverlayTrigger
            rootClose={true}
            trigger="click"
            placement={"top"}
            overlay={popoverContent}
          >
            <button
              id="info-button-all-posts-search"
              className="pt-0 pb-1 px-1 ms-2 mb-4"
            >
              <img src="/info_1.png" alt="info-icon" className="p-0 m-0" />
            </button>
          </OverlayTrigger>
        </div>
      </div>
    </div>
  );
};

export default AllPostsHeader;
