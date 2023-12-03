import axios from "axios";
export function setGoogleAccessToken(google_access_token) {
  return {
    type: "SET_GOOGLE_ACCESS_TOKEN",
    google_access_token,
  };
}
export function isWorkdiaryTokenCurrent(workdiary_token) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        "https://be-workdiary.onrender.com/users/check-workdiary-token",
        { headers: { Authorization: `Bearer ${workdiary_token}` } }
      );
      dispatch(setWorkdiaryToken(data.workdiary_token));
      // dispatch(initialLoad());
    } catch (error) {
      dispatch(resetApp());
      console.log(error);
    }
  };
}
export function loginGoogle(googleAccessToken) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        "https://be-workdiary.onrender.com/users/login-google",
        {
          google_access_token: googleAccessToken,
        }
      );
      dispatch(setWorkdiaryToken(data.workdiary_token));
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message);
      console.log(error);
    }
  };
}
export function login(formData) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        "https://be-workdiary.onrender.com/users/login",
        {
          ...formData,
        }
      );
      dispatch(setWorkdiaryToken(data.workdiary_token));
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message);
      console.log(error);
    }
  };
}

export function signup(formData) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        "https://be-workdiary.onrender.com/users/signup",
        {
          ...formData,
        }
      );
      dispatch(setWorkdiaryToken(data.workdiary_token));
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message);
      console.log(error);
    }
  };
}
export function changePassword(workdiary_token, formData) {
  return async function () {
    try {
      const { data } = await axios.patch(
        "https://be-workdiary.onrender.com/users/change-password",
        {
          ...formData,
        },
        { headers: { Authorization: `Bearer ${workdiary_token}` } }
      );
      alert(data.message);
    } catch (error) {
      alert(error?.response?.data?.message);
      // dispatch(resetApp());
      console.log(error);
    }
  };
}
export function forgotPassword(formData) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        "https://be-workdiary.onrender.com/users/forgot-password",
        {
          ...formData,
        }
      );
      alert(data.message);
    } catch (error) {
      alert(error?.response?.data?.message);
      dispatch(resetApp());
      console.log(error);
    }
  };
}
export function searchJournal(workdiary_token, query) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `https://be-workdiary.onrender.com/posts/search?query=${query}`,
        { headers: { Authorization: `Bearer ${workdiary_token}` } }
      );
      if (data.results.length === 0) {
        alert("No matches for this query");
      } else {
        dispatch(setSearchResults(data.results, data.query));
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function getUserAccountInfo(workdiary_token) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        "https://be-workdiary.onrender.com/users/account-info",
        { headers: { Authorization: `Bearer ${workdiary_token}` } }
      );
      dispatch(setUserAccountInfo(data.user));
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteAccount(workdiary_token) {
  return async function (dispatch) {
    try {
      await axios
        .delete("https://be-workdiary.onrender.com/users/delete", {
          headers: { Authorization: `Bearer ${workdiary_token}` },
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
export function deletePost(workdiary_token, date) {
  return async function (dispatch) {
    try {
      await axios
        .delete(`https://be-workdiary.onrender.com/posts/delete?date=${date}`, {
          headers: { Authorization: `Bearer ${workdiary_token}` },
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
export function getPost(workdiary_token, date) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `https://be-workdiary.onrender.com/posts?date=${date}`,
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setAllPostDates(data.all_post_dates));
      dispatch(setDate(data.date));
    } catch (error) {
      console.log(error);
    }
  };
}

export function updatePost(
  workdiary_token,
  date,
  summary_text,
  summary_voice,
  audio_duration
) {
  return async function (dispatch) {
    try {
      const { data } = await axios.patch(
        `https://be-workdiary.onrender.com/posts/update`,
        { workdiary_token, date, summary_text, summary_voice, audio_duration },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      // controls state of "Interpreting" button for when voice is transcribing
      if (summary_voice) {
        dispatch(toggleInterpreting());
      }
      dispatch(setPost(data.post));
      dispatch(setAllPostDates(data.all_post_dates));
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
  workdiary_token,
  date,
  summary_text,
  summary_voice,
  audio_duration
) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `https://be-workdiary.onrender.com/posts/create`,
        { workdiary_token, date, summary_text, summary_voice, audio_duration },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
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

export function createTabs(workdiary_token, date) {
  return async function (dispatch) {
    try {
      const newTabs = await queryTabs();
      const { data } = await axios.post(
        `https://be-workdiary.onrender.com/tabs/create`,
        { workdiary_token, date, tabs: newTabs },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      console.log(error);
    }
  };
}
function bulkOpenTabs(tabURLs, windowId) {
  for (let i = 0; i < tabURLs.length; i++) {
    chrome.tabs.create({
      url: tabURLs[i],
      windowId: windowId, // Specify the ID of the target window
      active: false, // Set 'active' to false to open tabs in the background
    });
  }
}

// export function bulkOpenTabs(tabURLs, windowId) {
//   chrome.tabs.query({ windowId }, function (tabs) {
//     const secondToLastIndex = tabs.length - 1; // Index of the second to last tab

//     for (let i = 0; i < tabURLs.length; i++) {
//       chrome.tabs.create({
//         url: tabURLs[i],
//         windowId: windowId, // Specify the ID of the target window
//         index: secondToLastIndex, // Set the index to open tabs as the second to last
//         active: false, // Set 'active' to false to open tabs in the background
//       });
//     }
//   });
// }
export function openTabs(tabUrls, windowId) {
  return async function (dispatch) {
    try {
      if (windowId) {
        bulkOpenTabs(tabUrls, windowId);
      } else {
        chrome.windows.create({ url: tabUrls });
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function createTag(workdiary_token, date, tag) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `https://be-workdiary.onrender.com/tags/create`,
        { workdiary_token, date, tag },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      console.log(error);
    }
  };
}
export function deleteTag(workdiary_token, date, tag_id) {
  return async function (dispatch) {
    try {
      const { data } = await axios.delete(
        `https://be-workdiary.onrender.com/tags/delete?date=${date}&tag_id=${tag_id}`,
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
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
export function bulkDeleteTabs(workdiary_token, date, tabs) {
  return async function (dispatch) {
    try {
      if (tabs) {
        const { data } = await axios.delete(
          `https://be-workdiary.onrender.com/tabs/bulk-delete?date=${date}&tab_ids=${arrayToCSV(
            tabs[0]?.tab_id !== undefined
              ? tabs.map((tab) => tab?.tab_id)
              : tabs
          )} `,
          {
            headers: { Authorization: `Bearer ${workdiary_token}` },
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
export function deleteTab(workdiary_token, date, tab_id) {
  return async function (dispatch) {
    try {
      const { data } = await axios.delete(
        `https://be-workdiary.onrender.com/tabs/delete?date=${date}&tab_id=${tab_id}`,
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      console.log(error);
    }
  };
}

export function changeAlarm(workdiary_token, user) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `https://be-workdiary.onrender.com/users/change-alarm`,
        { ...user },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
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
        console.log("fire alarm");
        chrome.notifications.create({
          type: "basic",
          iconUrl: "w_extension.png",
          title: "Work Diary",
          message: `Reminder to log in your Work Diary (click here to open app)`,
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

export function setWorkdiaryToken(workdiary_token) {
  return {
    type: "SET_Workdiary_TOKEN",
    workdiary_token,
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
export function setSearchResults(results, query) {
  return {
    type: "SET_SEARCH_RESULTS",
    results,
    query,
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
