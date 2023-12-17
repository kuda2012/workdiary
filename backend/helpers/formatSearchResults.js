const moment = require("moment");
function formatSearchResults(searchResults, query) {
  let disallowDuplicates = {};
  return searchResults
    .map((result) => {
      result.date = moment(result.date).format("MM/DD/YYYY");
      // if query is findable in first 20 chars of string, add first 20 chars and then ... {query}
      // query is not findable in first 20 chars of string, add first 20 chars and ...
      const popularDomains = [
        ".com",
        ".org",
        ".net",
        ".gov",
        ".edu",
        ".io",
        ".it",
        ".co",
        ".uk",
        ".za",
        ".de",
        ".cn",
        ".so",
        ".jp",
        ".ru",
        ".mx",
        ".br",
        ".fr",
        ".au",
        ".ca",
        ".es",
        ".it",
        ".nl",
        ".us",
        ".se",
      ];

      if (result.match_source === "tab") {
        let indexOfEnding = 30;
        let chosenDomain = popularDomains[0];
        for (let domain of popularDomains) {
          if (result[result.match_source].indexOf(domain) !== -1) {
            // finding what index the .com is located at
            chosenDomain = domain;
            indexOfEnding =
              result[result.match_source].indexOf(domain) + domain.length;
            break;
          }
        }
        // setting the appearance of the url string on the front end
        result[result.match_source] =
          result[result.match_source]
            .toLowerCase()
            .indexOf(query.toLowerCase()) <=
          indexOfEnding - chosenDomain.length + 1
            ? `${result[result.match_source].slice(0, indexOfEnding)}...`
            : `${result[result.match_source].slice(
                0,
                indexOfEnding
              )}...${query}`;
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
      };
    })
    .filter((result) => {
      if (result.match_source === "entry") {
        if (disallowDuplicates[result.date]) {
          return false;
        } else {
          disallowDuplicates[result.date] = true;
          return true;
        }
      }
      return true;
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
