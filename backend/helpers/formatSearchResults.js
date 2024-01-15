const moment = require("moment");
const ExpressError = require("../expressError");
function formatSearchResults(searchResults, searched_query) {
  return searchResults.map((result) => {
    result.date = moment(result.date, moment.ISO_8601).format("MM/DD/YYYY");
    result.original_string = result[result.match_source];
    // if searched_query is findable in first 20 chars of string, add first 20 chars and then ... {searched_query}
    // searched_query is not findable in first 20 chars of string, add first 20 chars and ...
    if (result.match_source === "tab") {
      let url = result.tab;
      const regex = /\./g;
      let match;
      const indices = [];

      while ((match = regex.exec(url)) !== null) {
        indices.push(match.index);
      }

      let indexOfDot = indices.length > 0 ? indices[indices.length - 1] : null;
      if (!indexOfDot) {
        return {
          date: result.date,
          [result.match_source]: result[result.match_source],
          match_source: result.match_source,
          original_string: result.original_string,
        };
      }

      // decide where to add ellipsis
      const ELLIPSIS = "...";
      url = url.slice(indexOfDot + 1);
      let index = url.match(/[\/?#:!]/)?.index || url.length;
      let domain = result.tab.slice(indexOfDot, index + indexOfDot + 1);
      let indexOfEnding = index + indexOfDot + 1;
      result[result.match_source] =
        result[result.match_source]
          .toLowerCase()
          .indexOf(searched_query.toLowerCase()) <=
        indexOfEnding - domain.length + 1
          ? `${result[result.match_source].slice(0, indexOfEnding)}${ELLIPSIS}`
          : `${result[result.match_source].slice(
              0,
              indexOfEnding
            )}${ELLIPSIS}${searched_query}`;
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
