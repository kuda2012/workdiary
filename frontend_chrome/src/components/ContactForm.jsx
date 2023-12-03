import React, { useState } from "react";
import { Button } from "reactstrap";
import axios from "axios";

const ContactForm = () => {
  const INITIAL_STATE = {
    name: "",
    email: "",
    subject: "",
    message: "",
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
        "https://be-workdiary.onrender.com/users/contact-us",
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
      <div className="card">
        <div className="card-body">
          Have a question, need assistance, or just wanna say hi? Contact us
          here or send an email to{" "}
          <a href="mailto:contact@workdiary.me">contact@workdiary.me</a>
          <form onSubmit={handleSubmit}>
            <div className="signup-form-items form-group">
              <label htmlFor="name">Name:</label>
              <input
                required={true}
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="signup-form-items form-group">
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
            </div>
            <div className="signup-form-items form-group">
              <label htmlFor="subject">Subject:</label>
              <input
                className="form-control"
                value={subject}
                onChange={handleChange}
                required
                type="text"
                name="subject"
              />
            </div>
            <div className="signup-form-items form-group">
              <label htmlFor="message">Message:</label>
              <textarea
                className="form-control"
                value={message}
                onChange={handleChange}
                required
                name="message"
              />
              <Button color="primary" className="mt-3">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ContactForm;