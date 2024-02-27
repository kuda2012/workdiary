import { useState } from "react";
import { Button } from "reactstrap";
const { VITE_BACKEND_URL } = import.meta.env;
import axios from "axios";
import "../styles/SendDownloadLink.css";

const SendDownloadLink = () => {
  const INITIAL_STATE = {
    email: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [linkSent, setLinkSet] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        `${VITE_BACKEND_URL}/users/send-download-link`,
        { ...formData }
      );
      setLinkSet(true);
      setMessage(response?.data?.message);
      setFormData(INITIAL_STATE);
    } catch (error) {
      setFormData(INITIAL_STATE);
      alert(error?.response?.data?.message);
    }
  };

  const { email } = formData;

  return (
    <>
      {!linkSent ? (
        <form
          name="send-download-link"
          className="mt-3"
          onSubmit={handleSubmit}
        >
          <label htmlFor="email">Email:</label>
          <input
            className="form-control"
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
            title="Enter a valid email address"
          />
          <Button color="primary" className="mt-3">
            Submit
          </Button>
        </form>
      ) : (
        <div
          className="my-3 text-success"
          id="send-download-link-response-message"
        >
          <b>{message}</b>
        </div>
      )}
    </>
  );
};

export default SendDownloadLink;
