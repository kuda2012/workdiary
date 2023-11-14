import axios from "axios";
export function setGoogleAccessToken(google_access_token) {
  return {
    type: "SET_GOOGLE_ACCESS_TOKEN",
    google_access_token,
  };
}
export function isWorksnapTokenCurrent(worksnap_token) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/users/check-worksnap-token",
        { headers: { Authorization: `Bearer ${worksnap_token}` } }
      );
      dispatch(setWorksnapToken(data.worksnap_token));
      // dispatch(initialLoad());
    } catch (error) {
      dispatch(resetApp());
      console.log(error);
    }
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
      dispatch(resetApp());
      console.log(error);
    }
  };
}
export function searchJournal(worksnap_token, query) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/posts/search?query=${query}`,
        { headers: { Authorization: `Bearer ${worksnap_token}` } }
      );
      if (data.results.length === 0) {
        alert("No matches for this query");
      } else {
        dispatch(setSearchResults(data.results));
      }
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
export function deletePost(worksnap_token, date) {
  return async function (dispatch) {
    try {
      await axios
        .delete(`http://localhost:3000/posts/delete?date=${date}`, {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        })
        .then(({ data }) => {
          setTimeout(() => {
            alert(data.message);
            dispatch(halfReset(data.all_post_dates));
          }, 1000);
        });
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
export function getAllPostDates(worksnap_token) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/posts/all-dates`,
        {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        }
      );
      dispatch(setAllPostDates(data.all_post_dates));
    } catch (error) {
      console.log(error);
    }
  };
}
export function updatePost(
  worksnap_token,
  date,
  summary_text,
  summary_voice,
  audio_duration
) {
  return async function (dispatch) {
    try {
      const { data } = await axios.patch(
        `http://localhost:3000/posts/update`,
        { worksnap_token, date, summary_text, summary_voice, audio_duration },
        {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        }
      );
      // controls state of "Interpreting" button for when voice is transcribing
      if (summary_voice) {
        dispatch(toggleInterpreting());
      }
      if (data.transcription_error_msg) {
        alert(data.transcription_error_msg);
      }
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      if (summary_voice) {
        dispatch(toggleInterpreting());
      }
      console.log(error);
    }
  };
}

export function createPost(
  worksnap_token,
  date,
  summary_text,
  summary_voice,
  audio_duration
) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/posts/create`,
        { worksnap_token, date, summary_text, summary_voice, audio_duration },
        {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        }
      );
      if (summary_voice) {
        dispatch(toggleInterpreting());
      }
      dispatch(setPost(data.post));
      dispatch(setAllPostDates(data.all_post_dates));
      if (data.transcription_error_msg) {
        alert(data.transcription_error_msg);
      }
      dispatch(setDate(data.date));
    } catch (error) {
      if (summary_voice) {
        dispatch(toggleInterpreting());
      }
      console.log(error);
    }
  };
}
async function queryTabs() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        const newTabs = tabs.map((tab) => {
          return { title: tab.title, url: tab.url, icon: tab.favIconUrl };
        });
        resolve(newTabs);
      }
    });
  });
}

export function createTabs(worksnap_token, date) {
  return async function (dispatch) {
    try {
      const newTabs = await queryTabs();
      const { data } = await axios.post(
        `http://localhost:3000/tabs/create`,
        { worksnap_token, date, tabs: newTabs },
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
export function openTabs(tabUrls) {
  return async function (dispatch) {
    try {
      chrome.windows.create({ url: tabUrls }, (newWindow) => {
        // Do something with the new window if needed
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function createTag(worksnap_token, date, tag) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/tags/create`,
        { worksnap_token, date, tag },
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
export function deleteTag(worksnap_token, date, tag_id) {
  return async function (dispatch) {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/tags/delete?date=${date}&tag_id=${tag_id}`,
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
function arrayToCSV(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return ""; // Return an empty string for an empty array or invalid input
  }

  // Use the map function to convert array values to strings
  const csvArray = arr.map((value) => {
    if (typeof value === "string") {
      // Escape double quotes by doubling them up
      return `"${value.replace(/"/g, '""')}"`;
    }
    return String(value);
  });

  // Join the array elements with commas
  return csvArray.join(",");
}
export function bulkDeleteTabs(worksnap_token, date, tabs) {
  return async function (dispatch) {
    try {
      if (tabs) {
        const { data } = await axios.delete(
          `http://localhost:3000/tabs/bulkDelete?date=${date}&tab_ids=${arrayToCSV(
            tabs[0]?.tab_id !== undefined
              ? tabs.map((tab) => tab?.tab_id)
              : tabs
          )} `,
          {
            headers: { Authorization: `Bearer ${worksnap_token}` },
          }
        );
        dispatch(setPost(data.post));
        dispatch(setDate(data.date));
      }
    } catch (error) {
      console.log(error);
    }
  };
}
export function deleteTab(worksnap_token, date, tab_id) {
  return async function (dispatch) {
    try {
      const { data } = await axios.delete(
        `http://localhost:3000/tabs/delete?date=${date}&tab_id=${tab_id}`,
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

export function changeAlarm(worksnap_token, user) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/users/change-alarm`,
        { ...user },
        {
          headers: { Authorization: `Bearer ${worksnap_token}` },
        }
      );
      dispatch(setUserAccountInfo(data.user));
    } catch (error) {
      console.log(error);
    }
  };
}

export async function setAlarm(user) {
  // In your content script or background script that has access to the tabId:
  await chrome.alarms.clearAll();
  // Get the current date
  const currentDate = new Date();

  // Define the day you want to check (e.g., "mon")

  // Get the current day of the week as a string (e.g., "mon")
  const currentDay = currentDate
    .toLocaleString("en-us", { weekday: "short" })
    .toLowerCase();

  // Check if today is the specified day
  let shouldSetAlarm = false;
  for (let day of user.alarm_days) {
    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour12: false,
    });

    if (
      user.alarm_status &&
      currentDay === day.day &&
      day.value &&
      currentTime < user.alarm_time
    ) {
      shouldSetAlarm = (await chrome.alarms.get("myAlarm")) ? false : true;
      break;
    }
  }

  if (shouldSetAlarm) {
    // Get the current time
    const currentTime = new Date();

    // Parse the military time string "17:00" and set it to today's date
    const militaryTimeString = user.alarm_time;
    const militaryTimeArray = militaryTimeString.split(":");
    const militaryTime = new Date();
    militaryTime.setHours(parseInt(militaryTimeArray[0], 10));
    militaryTime.setMinutes(parseInt(militaryTimeArray[1], 10));
    militaryTime.setSeconds(0);

    // Calculate the time difference in seconds
    const timeDifferenceInSeconds = Number(
      Math.floor(militaryTime - currentTime)
    );
    console.log(currentTime, militaryTimeString);
    console.log(`Time difference in seconds: ${timeDifferenceInSeconds}`);
    chrome.alarms.create("myAlarm", {
      when: Date.now() + timeDifferenceInSeconds, // Set the alarm to go off in 1 second.
    });
    chrome.alarms.onAlarm.addListener(async (alarm) => {
      if (alarm.name === "myAlarm") {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "w_extension.png",
          title: "Worksnap",
          message: `Your ${user.alarm_time} reminder to log in your worksnap journal`,
          // Include sound property for the sound file
        });

        // const audio = new Audio(chrome.runtime.getURL("game-alarm.wav"));
        // audio.volume = 0.5; // Get the URL to your sound fil
        // audio.play();
        // setTimeout(() => {
        //   audio.pause();
        // }, 2000);
      }
    });
  }
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
export function clearSearchResults() {
  return {
    type: "CLEAR_SEARCH_RESULTS",
  };
}
export function setSearchResults(results) {
  return {
    type: "SET_SEARCH_RESULTS",
    results,
  };
}
export function halfReset(all_post_dates) {
  return {
    type: "HALF_RESET",
    all_post_dates,
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
export function setAllPostDates(all_post_dates) {
  return {
    type: "SET_ALL_POST_DATES",
    all_post_dates,
  };
}
export function toggleInterpreting() {
  return {
    type: "TOGGLE_INTERPRETING",
  };
}
export function initialLoad() {
  return {
    type: "INITIAL_LOAD",
  };
}

export function loggingIn() {
  return {
    type: "LOGGING_IN",
  };
}
