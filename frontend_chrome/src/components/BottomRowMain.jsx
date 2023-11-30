import { useState } from "react";
import { useSelector } from "react-redux";
import DeletePostModal from "./DeletePostModal";
import DeletePost from "./DeletePost";

const BottomRowMain = () => {
  const post = useSelector((state) => state.post);

  const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
  const openDeletePostModal = () => setIsDeletePostModalOpen(true);
  const closeDeletePostModal = () => setIsDeletePostModalOpen(false);

  return (
    <div className="row">
      <div className="col">
        <button
          style={{ position: "relative", left: "300px" }}
          onClick={() => {
            if (post) {
              openDeletePostModal();
            } else {
              alert(
                "You have not save anything to this date, there's nothing to delete."
              );
            }
          }}
        >
          Delete Post
        </button>
        {isDeletePostModalOpen && (
          <DeletePostModal
            isDeletePostModalOpen={isDeletePostModalOpen}
            closeDeletePostModal={closeDeletePostModal}
          >
            <DeletePost closeDeletePostModal={closeDeletePostModal} />
          </DeletePostModal>
        )}
      </div>
    </div>
  );
};

export default BottomRowMain;
