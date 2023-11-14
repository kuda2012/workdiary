const moment = require("moment");
function formatSearchResults(searchResults, query) {
  searchResults.map((result) => {
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

    if (result.match_source === "url") {
      let indexOfEnding;
      let chosenDomain;
      for (let domain of popularDomains) {
        if (result[result.match_source].indexOf(domain) !== -1) {
          chosenDomain = domain;
          indexOfEnding =
            result[result.match_source].indexOf(domain) + domain.length;
          break;
        }
      }
      result[result.match_source] =
        result[result.match_source].toLowerCase().indexOf(query.toLowerCase()) <
        indexOfEnding - chosenDomain.length
          ? `${result[result.match_source].slice(0, indexOfEnding)}...`
          : `${result[result.match_source].slice(0, indexOfEnding)}...${query}`;
    } else if (result.match_source === "summary_text") {
      result[result.match_source] = result[result.match_source].replace(
        /<[^>]*>/g,
        ""
      );
      result[result.match_source] = `...${result[result.match_source].slice(
        result[result.match_source].toLowerCase().indexOf(query.toLowerCase()) -
          15,
        result[result.match_source].toLowerCase().indexOf(query.toLowerCase()) +
          15
      )}...`;
    }
    return {
      date: result.date,
      [result.match_source]: result[result.match_source],
      match_source: result.match_source,
    };
  });
  return searchResults;
}

module.exports = { formatSearchResults };
