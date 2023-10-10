import axios from "axios";
export function setGoogleAccessToken(google_access_token) {
  return {
    type: "SET_GOOGLE_ACCESS_TOKEN",
    google_access_token,
  };
}
export function getWorksnapToken(googleAccessToken) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post("http://localhost:3000/users/login", {
        google_access_token: googleAccessToken,
      });
      dispatch(setWorksnapToken(data.worksnap_token));
    } catch (error) {
      console.log(error);
    }
  };
}
export function getUserAccountInfo(worksnap_token) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/users/account-info",
        { headers: { Authorization: `Bearer ${worksnap_token}` } }
      );
      dispatch(setUserAccountInfo(data.user));
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteAccount(worksnap_token) {
  return async function (dispatch) {
    try {
      await axios
        .delete("http://localhost:3000/users/delete", {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        })
        .then(({ data }) => {
          setTimeout(() => {
            alert(data.message);
          }, 1000);
        });
      dispatch(resetApp());
    } catch (error) {
      console.log(error);
    }
  };
}
export function getPost(worksnap_token, date) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/posts?date=${date}`,
        {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      console.log(error);
    }
  };
}
export function updatePost(worksnap_token, date, summary_text) {
  return async function (dispatch) {
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/posts/update`,
        { worksnap_token, date, summary_text },
        {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      console.log(error);
    }
  };
}

export function createPost(worksnap_token, date, summary_text) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/posts/create`,
        { worksnap_token, date, summary_text },
        {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      console.log(error);
    }
  };
}
export function setWorksnapToken(worksnap_token) {
  return {
    type: "SET_WORKSNAP_TOKEN",
    worksnap_token,
  };
}
export function setUserAccountInfo(user) {
  return {
    type: "SET_USER",
    user,
  };
}

export function resetApp() {
  return {
    type: "FULL_RESET",
  };
}
export function setDate(date) {
  return {
    type: "SET_DATE",
    date,
  };
}
export function setPost(post) {
  return {
    type: "SET_POST",
    post,
  };
}
