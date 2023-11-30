import React from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSearchResults,
  getPost,
  searchJournal,
} from "../helpers/actionCreators";

const SearchBar = ({ toggleSearchBar }) => {
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
    <form
      className="search-bar"
      onSubmit={handleFormSubmit}
      style={{
        width: "20%",
        position: "relative",
        right: "135px",
        textAlign: "left",
      }}
    >
      <input
        id="search"
        type="text"
        // placeholder="Search..."
        value={searchText}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        style={{ width: "100%" }}
      />
      {isOpen && searchResults && (
        <div
          className="search-results"
          style={{
            position: "absolute",
            zIndex: 1, // Places it above other content
            top: "100%", // Position below the input
            maxHeight: "300px",
            overflowY: "auto",
            width: "100%",
          }}
        >
          {searchResults.map((result, index) => (
            <button
              type="button"
              key={index}
              className="result-item"
              onClick={() => {
                handleResultClick(result);
              }}
              style={{
                width: "100%",
                textAlign: "left",
              }}
            >
              Date: {result.date} -{" "}
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
