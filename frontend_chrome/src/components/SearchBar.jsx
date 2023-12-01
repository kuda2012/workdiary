import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchResults,
  getPost,
  searchJournal,
} from "../helpers/actionCreators";
import "../styles/SearchBar.css";

const SearchBar = ({ toggleSearchBar }) => {
  // State to hold the search input text
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const searchResults = useSelector((state) => state.search_results);
  const query = useSelector((state) => state.query);

  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("" || query);
  const [isOpen, setIsOpen] = useState(false);

  // Handler to update the search input text
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  // Handler to dispatch the search contents to the search function
  const handleSearch = () => {
    // Call the search function with the search input text
    setIsOpen(true);
    dispatch(searchJournal(worksnapToken, searchText));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (searchText.trim() !== "") {
      // Check if the search text is not empty or only contains whitespace
      handleSearch();
    }
  };

  // Handler to select a result item and call getPost
  const handleResultClick = (item) => {
    setSearchText(""); // Clear the search input
    if (item && item.date) {
      // Call the getPost function with the selected date
      dispatch(getPost(worksnapToken, moment(item.date).format("MM/DD/YYYY")));
      dispatch(clearSearchResults()); // You need to define the getPost function
      toggleSearchBar();
    }
  };
  return (
    <form id="search-bar-form" onSubmit={handleFormSubmit}>
      <input
        id="search-input"
        type="text"
        value={searchText}
        autocomplete="off"
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
      />
      {isOpen && searchResults && (
        <div id="search-results-container">
          {searchResults.map((result, index) => (
            <button
              className="search-results"
              type="button"
              key={index}
              onClick={() => {
                handleResultClick(result);
              }}
            >
              Date: {result.date} -{" "}
              {result.match_source === "tab_title"
                ? "tab title"
                : result.match_source}
              : {result[result.match_source]}
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
