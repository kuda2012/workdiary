import { useDispatch, useSelector } from "react-redux";
import {
  clearScrollTo,
  clearSearchResults,
  deletePost,
  getPostsList,
} from "../helpers/actionCreators";
import { Button } from "reactstrap";

const DeletePost = ({ closeDeletePostModal }) => {
  const date = useSelector((state) => state.date);
  const post = useSelector((state) => state.post);
  const workdiaryToken = useSelector((state) => state.workdiary_token);
  const dispatch = useDispatch();
  return (
    <div>
      <p>Are you sure you want to delete your post for {date}?</p>
      <Button
        color="danger"
        className="mr-1"
        onClick={() => {
          if (post) {
            dispatch(deletePost(workdiaryToken, date));
            dispatch(clearSearchResults());
            dispatch(clearScrollTo());
            dispatch(getPostsList(workdiaryToken, 1));
            closeDeletePostModal();
          } else {
            alert(
              "You have not saved anything to this date, there's nothing to delete."
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
