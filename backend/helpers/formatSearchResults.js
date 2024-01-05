const moment = require("moment");
const ExpressError = require("../expressError");
function formatSearchResults(searchResults, query) {
  return searchResults.map((result) => {
    result.date = moment(result.date).format("MM/DD/YYYY");
    result.original_string = result[result.match_source];
    // if query is findable in first 20 chars of string, add first 20 chars and then ... {query}
    // query is not findable in first 20 chars of string, add first 20 chars and ...
    if (result.match_source === "tab") {
      // let indexOfEnding = 30;
      // let chosenDomain = popularDomains[0];
      let url = result.tab;
      const regex = /\./g;
      let match;
      const indices = [];

      while ((match = regex.exec(url)) !== null) {
        indices.push(match.index);
      }

      let indexOfDot = indices.length > 0 ? indices[indices.length - 1] : null;
      if (!indexOfDot) {
        throw new ExpressError("No . in tab url", 400);
      }

      url = url.slice(indexOfDot + 1);
      let index = url.match(/[\/?#:!]/)?.index || url.length;
      let domain = result.tab.slice(indexOfDot, index + indexOfDot + 1);
      let indexOfEnding = index + indexOfDot + 1;
      result[result.match_source] =
        result[result.match_source]
          .toLowerCase()
          .indexOf(query.toLowerCase()) <=
        indexOfEnding - domain.length + 1
          ? `${result[result.match_source].slice(0, indexOfEnding)}...`
          : `${result[result.match_source].slice(0, indexOfEnding)}...${query}`;
    } else if (result.match_source === "entry") {
      result[result.match_source] = result[result.match_source].replace(
        /<[^>]*>/g,
        ""
      );
      result[result.match_source] = generateFinalString(
        query,
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

function generateFinalString(query, fullString) {
  const index = fullString.toLowerCase().indexOf(query.toLowerCase());

  if (index === 0) {
    // Case 1: Query at the beginning of the full string
    const words = fullString.split(" ");
    const slicedWords = words.slice(0, 5); // Adjust the number of words to display
    const finalString = `${slicedWords.join(" ")}...`;
    return finalString;
  } else if (index === fullString.length - query.length) {
    // Case 3: Query at the end of the full string
    const words = fullString.split(" ");
    const slicedWords = words.slice(-5); // Adjust the number of words to display
    const finalString = `...${slicedWords.join(" ")}`;
    return finalString;
  } else if (index > 0) {
    // Case 2: Query in the middle of the full string
    const wordsBeforeQuery = fullString.substr(0, index).split(" ");
    const wordsAfterQuery = fullString.substr(index).split(" ");
    const slicedWordsBefore = wordsBeforeQuery.slice(-3); // Words before query
    const slicedWordsAfter = wordsAfterQuery.slice(0, 3); // Words after query
    const finalString = `...${slicedWordsBefore.join(
      " "
    )} ${slicedWordsAfter.join(" ")}...`;
    return finalString;
  } else {
    // Query not found in the full string
    return "";
  }
}

module.exports = { formatSearchResults };
