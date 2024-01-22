const moment = require("moment");
const ExpressError = require("../expressError");
function formatSearchResults(searchResults, searched_query) {
  return searchResults.map((result) => {
    result.date = moment(result.date, moment.ISO_8601).format("MM/DD/YYYY");
    result.original_string = result[result.match_source];
    // if searched_query is findable in first 20 chars of string, add first 20 chars and then ... {searched_query}
    // searched_query is not findable in first 20 chars of string, add first 20 chars and ...
    if (result.match_source === "tab_title") {
      let sourceText = result.tab_title.toLowerCase();
      let searchText = searched_query.toLowerCase();

      // Find the match within the entire sourceText
      let indexOfMatch = sourceText.indexOf(searchText);

      // Determine the context window size in terms of words
      const CONTEXT_WORD_COUNT = 6;

      // Adjust startIndex and endIndex to word boundaries, considering full string
      let startIndex = Math.max(
        0,
        sourceText.lastIndexOf(" ", indexOfMatch - CONTEXT_WORD_COUNT) + 1
      ); // Find previous space
      let endIndex =
        sourceText.indexOf(
          " ",
          indexOfMatch + searchText.length + CONTEXT_WORD_COUNT
        ) || sourceText.length; // Find next space after context window

      // Extract the highlighted section
      // let highlightedText = sourceText.slice(startIndex, endIndex);
      let highlightedText = result.tab_title.slice(
        0,
        sourceText.slice(startIndex, endIndex).length
      );

      // Apply ellipsis if necessary, considering full string length
      if (startIndex > 0 || endIndex < sourceText.length) {
        highlightedText = `${startIndex > 0 ? "..." : ""}${highlightedText}${
          endIndex < sourceText.length ? "..." : ""
        }`;
      }

      // Update the source with the highlighted section
      result[result.match_source] = highlightedText;
    } else if (result.match_source === "tab") {
      let url = new URL(result.tab);

      // Extract the origin of the URL and convert to lowercase
      let primaryUrl = url.origin.toLowerCase();

      let formattedUrl = url.href;

      if (url.protocol === "chrome-extension:") {
        formattedUrl = url.href;
      } else if (searched_query.includes("html")) {
        formattedUrl = primaryUrl + "..." + "html";
      } else if (primaryUrl.includes(searched_query)) {
        // Check if the match is within the primary URL
        // If so, just use the primary URL with ellipsis
        formattedUrl = primaryUrl + "...";
      } else {
        // Otherwise, construct the full formatted URL with ellipsis
        let pathnameAndSearch =
          url.pathname.slice(primaryUrl.length) + searched_query;
        formattedUrl = primaryUrl + "..." + pathnameAndSearch + "...";
      }

      // Update the source with the formatted URL
      result[result.match_source] = formattedUrl;
    } else if (result.match_source === "entry") {
      result[result.match_source] = result[result.match_source].replace(
        /<[^>]*>/g,
        ""
      );
      result[result.match_source] = generateFinalString(
        searched_query,
        result[result.match_source]
      );
    }
    return {
      date: result.date,
      [result.match_source]: result[result.match_source],
      match_source: result.match_source,
      original_string: result.original_string,
      searched_query,
    };
  });
}

function generateFinalString(searched_query, fullString) {
  const index = fullString.toLowerCase().indexOf(searched_query.toLowerCase());
  const ELLIPSIS = "...";
  if (index === 0) {
    // Case 1: searched_query at the beginning of the full string
    const words = fullString.split(" ");
    const slicedWords = words.slice(0, 5); // Adjust the number of words to display
    const finalString = `${slicedWords.join(" ")}${ELLIPSIS}`;
    return finalString;
  } else if (index === fullString.length - searched_query.length) {
    // Case 3: searched_query at the end of the full string
    const words = fullString.split(" ");
    const slicedWords = words.slice(-5); // Adjust the number of words to display
    const finalString = `${ELLIPSIS}${slicedWords.join(" ")}`;
    return finalString;
  } else if (index > 0) {
    // Case 2: searched_query in the middle of the full string
    const wordsBeforesearched_query = fullString.substr(0, index).split(" ");
    const wordsAftersearched_query = fullString.substr(index).split(" ");
    const slicedWordsBefore = wordsBeforesearched_query.slice(-3); // Words before searched_query
    const slicedWordsAfter = wordsAftersearched_query.slice(0, 3); // Words after searched_query
    const finalString = `${ELLIPSIS}${slicedWordsBefore.join(
      " "
    )} ${slicedWordsAfter.join(" ")}${ELLIPSIS}`;
    return finalString;
  } else {
    // searched_query not found in the full string
    return "";
  }
}

module.exports = { formatSearchResults };
