import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost } from "../helpers/actionCreators";
import { Button } from "reactstrap";

const DeletePost = ({ closeDeletePostModal }) => {
  const date = useSelector((state) => state.date);
  const post = useSelector((state) => state.post);
  const worksnapToken = useSelector((state) => state.worksnap_token);
  const dispatch = useDispatch();
  return (
    <div style={{ textAlign: "center" }}>
      <p>Are you sure you want to delete your post for {date}?</p>
      <Button
        color="danger"
        className="mr-1"
        onClick={() => {
          if (post) {
            dispatch(deletePost(worksnapToken, date));
          } else {
            alert(
              "You have not save anything to this date, there's nothing to delete."
            );
          }
        }}
      >
        Yes
      </Button>
      <Button
        color="success"
        className="ms-1"
        onClick={() => closeDeletePostModal()}
      >
        No
      </Button>
    </div>
  );
};

export default DeletePost;
