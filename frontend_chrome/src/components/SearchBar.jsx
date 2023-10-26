import React, { useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchResults,
  getPost,
  searchJournal,
} from "../helpers/actionCreators";

const SearchBar = ({ search }) => {
  // State to hold the search input text
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const searchResults = useSelector((state) => state.search_results);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Handler to update the search input text
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  // Handler to dispatch the search contents to the search function
  const handleSearch = () => {
    // Call the search function with the search input text
    dispatch(searchJournal(worksnapToken, searchText));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission
    if (searchText.trim() !== "") {
      // Check if the search text is not empty or only contains whitespace
      handleSearch();
    }
  };

  // Handler to select a result item and call getPost
  const handleResultClick = (item) => {
    setSearchText(""); // Clear the search input
    setIsOpen(false); // Close the dropdown

    if (item && item.date) {
      // Call the getPost function with the selected date
      dispatch(getPost(worksnapToken, moment(item.date).format("MM/DD/YYYY")));
      dispatch(clearSearchResults()); // You need to define the getPost function
    }
  };

  return (
    <form onSubmit={handleFormSubmit} style={{ textAlign: "left" }}>
      <input
        id="search"
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
      />
      {searchResults && (
        <div className="search-results">
          {searchResults.map((result, index) => (
            <button
              key={index}
              className="result-item"
              onClick={() => {
                handleResultClick(result);
              }}
            >
              Date: {result.date},{" "}
              {result.match_source === "summary_text"
                ? "Summary"
                : result.match_source.charAt(0).toUpperCase() +
                  result.match_source.slice(1)}
              : {result[result.match_source]}
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default SearchBar;
