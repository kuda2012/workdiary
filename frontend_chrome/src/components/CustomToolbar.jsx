const CustomToolBar = ({ openTagsModal }) => {
  return (
    <div id="toolbar">
      <select
        className="ql-header"
        defaultValue={""}
        onChange={(e) => e.persist()}
      >
        <option value="1" />
        <option value="2" />
        <option value="" selected />
      </select>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-strike" />
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button
        className="showTags"
        onClick={openTagsModal}
        style={{ position: "relative", bottom: "3px" }}
      >
        <b>Tags</b>
      </button>
    </div>
  );
};

export default CustomToolBar;
