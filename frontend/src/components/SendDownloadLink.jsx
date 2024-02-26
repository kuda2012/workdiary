import { useState } from "react";
import { Button } from "reactstrap";
import axios from "axios";
const { VITE_BACKEND_URL } = import.meta.env;

const SendDownloadLink = () => {
  const INITIAL_STATE = {
    email: "",
  };
  const [formData, setFormData] = useState(INITIAL_STATE);

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
      alert(response?.data?.message);
      setFormData(INITIAL_STATE);
    } catch (error) {
      setFormData(INITIAL_STATE);
      alert(error?.response?.data?.message);
    }
  };

  const { name, email, subject, message } = formData;

  return (
    <>
      <form name="send-download-link" className="mt-3" onSubmit={handleSubmit}>
        {/* <div className="signup-form-items form-group"> */}
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
        {/* </div> */}
      </form>
    </>
  );
};

export default SendDownloadLink;
