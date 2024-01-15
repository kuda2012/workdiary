import { useSelector } from "react-redux";
import "../styles/Tag.css";
const Tag = ({ tag, onTagDelete }) => {
  const clickedSearchResult = useSelector(
    (state) => state.clicked_search_result
  );

  const isTagMatch =
    clickedSearchResult?.tag &&
    tag.text && // Ensure tag.text is also defined
    clickedSearchResult.tag
      .split(",")
      .some((csvTag) => csvTag.trim() === tag.text);

  return (
    <span
      className={`tag bg-${
        isTagMatch && clickedSearchResult?.match_source === "tag"
          ? "warning"
          : "info"
      } text-center m-1 ps-3 pe-1 py-1`}
    >
      <b className="text-white">{tag.text}</b>
      <button
        className={`btn btn-${
          isTagMatch && clickedSearchResult?.match_source === "tag"
            ? "warning"
            : "info"
        } delete-tag text-dark p-1 mx-1`}
        onClick={() => onTagDelete(tag.tag_id)}
      >
        X
      </button>
    </span>
  );
};

export default Tag;
