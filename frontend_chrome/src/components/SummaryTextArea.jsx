import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import { Autosave } from "react-autosave";
import { createTag } from "../helpers/actionCreators";
import AddTagsButton from "./AddTagsButton";

function addTags() {
  console.log("hello");
}
const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      addTags: () => addTags(),
    },
  },
};

const SummaryTextArea = ({ dispatchUpdatePost }) => {
  const summaryText = useSelector((state) => state?.post?.summary_text);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const date = useSelector((state) => state.date);
  const [localSummaryText, setLocalSummaryText] = useState(summaryText || "");
  const [buttonText, setButtonText] = useState("Save");
  const dispatch = useDispatch();

  const handleChange = (value) => {
    setLocalSummaryText(value);
    setButtonText("Save");
  };
  function onTagAdd(tag) {
    dispatch(createTag(worksnapToken, date, tag));
  }

  useEffect(() => {
    setLocalSummaryText(summaryText);
  }, [summaryText]);

  return (
    <div>
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
        <AddTagsButton onTagAdd={onTagAdd} />
      </div>
      <ReactQuill
        value={localSummaryText}
        onChange={handleChange}
        modules={modules}
      />

      <Autosave
        data={localSummaryText}
        interval={1500}
        onSave={(data) => {
          if (localSummaryText !== summaryText) {
            dispatchUpdatePost(data);
            setButtonText("Saved");
          }
        }}
      />
      <button
        onClick={() => {
          dispatchUpdatePost(localSummaryText);
          setButtonText("Saved");
        }}
      >
        {buttonText === "Saved" && <b>{buttonText}</b>}
        {buttonText === "Save" && <>{buttonText}</>}
      </button>
    </div>
  );
};

export default SummaryTextArea;
