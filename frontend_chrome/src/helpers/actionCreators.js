var { VITE_LOCAL_BACKEND_URL } = import.meta.env;
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
      const { data } = await axios.post(
        `${VITE_LOCAL_BACKEND_URL}/users/check-workdiary-token`,
        { source: "actionCreator.js" },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      if (data.workdiary_token) {
        dispatch(setWorkdiaryToken(data.workdiary_token));
      } else {
        dispatch(resetApp());
      }
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function loginOrSignupGoogle(googleAccessToken) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${VITE_LOCAL_BACKEND_URL}/users/login-signup-google`,
        {
          google_access_token: googleAccessToken,
        }
      );
      dispatch(setWorkdiaryToken(data.workdiary_token));
      dispatch(loggingIn(false));
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

export function revokeAccessToken(googleAccessToken) {
  return async function (dispatch) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${googleAccessToken}`
      );
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function login(formData) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${VITE_LOCAL_BACKEND_URL}/users/login`,
        {
          ...formData,
        }
      );
      dispatch(setWorkdiaryToken(data.workdiary_token));
      dispatch(loggingIn(false));
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

export function signup(formData) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${VITE_LOCAL_BACKEND_URL}/users/signup`,
        {
          ...formData,
        }
      );
      alert(data.message);
      dispatch(loggingIn(false));
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function changePassword(workdiary_token, formData) {
  return async function () {
    try {
      const { data } = await axios.patch(
        `${VITE_LOCAL_BACKEND_URL}/users/change-password`,
        {
          ...formData,
        },
        { headers: { Authorization: `Bearer ${workdiary_token}` } }
      );
      alert(data.message);
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      // dispatch(resetApp());
      console.log(error);
    }
  };
}
export function forgotPassword(formData) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${VITE_LOCAL_BACKEND_URL}/users/forgot-password`,
        {
          ...formData,
        }
      );
      alert(data.message);
    } catch (error) {
      dispatch(resetApp());
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function searchDiary(workdiary_token, query, current_page = 1) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `${VITE_LOCAL_BACKEND_URL}/posts/search?query=${query}&current_page=${current_page}`,
        { headers: { Authorization: `Bearer ${workdiary_token}` } }
      );
      if (data.results.length === 0) {
        alert("No matches for this query");
        dispatch(setShowAllPosts(true));
      } else {
        dispatch(setSearchResults(data.results, data.query, data.pagination));
      }
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

export function getUserAccountInfo(workdiary_token) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `${VITE_LOCAL_BACKEND_URL}/users/account-info`,
        { headers: { Authorization: `Bearer ${workdiary_token}` } }
      );
      if (data.user) {
        chrome.storage.session.set({ user: data.user });
      }

      dispatch(setUserAccountInfo(data.user));
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

export function deleteAccount(workdiary_token) {
  return async function (dispatch) {
    try {
      await axios
        .delete(`${VITE_LOCAL_BACKEND_URL}/users/delete`, {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        })
        .then(({ data }) => {
          alert(data.message);
          dispatch(resetApp());
          window.location.reload();
        });
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function deletePost(workdiary_token, date) {
  return async function (dispatch) {
    try {
      await axios
        .delete(`${VITE_LOCAL_BACKEND_URL}/posts/delete?date=${date}`, {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        })
        .then(({ data }) => {
          alert(data.message);
          window.location.reload();
          dispatch(halfReset());
          dispatch(setAllPostDates(data.all_post_dates));
        });
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function getPost(workdiary_token, date) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `${VITE_LOCAL_BACKEND_URL}/posts/get-post?date=${date}`,
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setAllPostDates(data.all_post_dates));
      dispatch(setDate(data.date));
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
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
        `${VITE_LOCAL_BACKEND_URL}/posts/update`,
        {
          workdiary_token,
          date,
          summary_text,
          summary_voice,
          audio_duration,
        },
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
      alert(error?.response?.data?.message || error?.message);
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
        `${VITE_LOCAL_BACKEND_URL}/posts/create`,
        {
          workdiary_token,
          date,
          summary_text,
          summary_voice,
          audio_duration,
        },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
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
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

export function getPostsList(workdiary_token, currentPage = 1) {
  return async function (dispatch) {
    try {
      const { data } = await axios.get(
        `${VITE_LOCAL_BACKEND_URL}/posts/list-all-posts?current_page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      if (data?.posts_list?.length > 0) {
        dispatch(setPostsList(data.posts_list, data.pagination));
      } else if (data?.posts_list?.length === 0) {
        dispatch(setPostsList(null, data.pagination));
      }
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
async function queryTabs(currentTabs) {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({}, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        let newTabs = tabs;
        if (currentTabs) {
          newTabs = tabs.filter((tab) => {
            for (let i = 0; i < currentTabs.length; i++) {
              if (currentTabs[i].url === tab.url) {
                return false;
              }
            }
            return true;
          });
        }
        resolve(
          newTabs.map((tab) => {
            return {
              title: tab.title,
              url: tab.url,
              icon: tab.favIconUrl,
            };
          })
        );
      }
    });
  });
}

export function createTabs(workdiary_token, date, currentTabs) {
  return async function (dispatch) {
    try {
      const newTabs = await queryTabs(currentTabs);
      if (newTabs.length > 0) {
        const { data } = await axios.post(
          `${VITE_LOCAL_BACKEND_URL}/tabs/create`,
          { workdiary_token, date, tabs: newTabs },
          {
            headers: { Authorization: `Bearer ${workdiary_token}` },
          }
        );
        dispatch(setPost(data.post));
        dispatch(setDate(data.date));
      }
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
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

export function openTabs(tabUrls, windowId) {
  return async function () {
    try {
      if (windowId && tabUrls.length > 0) {
        bulkOpenTabs(tabUrls, windowId);
      } else {
        chrome.windows.create({ url: tabUrls });
      }
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

export function createTag(workdiary_token, date, tag) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${VITE_LOCAL_BACKEND_URL}/tags/create`,
        { workdiary_token, date, tag },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function deleteTag(workdiary_token, date, tag_id) {
  return async function (dispatch) {
    try {
      const { data } = await axios.delete(
        `${VITE_LOCAL_BACKEND_URL}/tags/delete?date=${date}&tag_id=${tag_id}`,
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      if (data.all_post_dates) {
        dispatch(setAllPostDates(data.all_post_dates));
      }
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
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
          `${VITE_LOCAL_BACKEND_URL}/tabs/bulk-delete?date=${date}&tab_ids=${arrayToCSV(
            tabs[0]?.tab_id !== undefined
              ? tabs.map((tab) => tab?.tab_id)
              : tabs
          )} `,
          {
            headers: { Authorization: `Bearer ${workdiary_token}` },
          }
        );
        if (data.all_post_dates) {
          dispatch(setAllPostDates(data.all_post_dates));
        }
        dispatch(setPost(data.post));
        dispatch(setDate(data.date));
      }
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

export function multiDeletePosts(workdiary_token, dates, currentDate) {
  return async function (dispatch) {
    try {
      const convertDatesArrToCsv = arrayToCSV(dates);
      if (dates) {
        const { data } = await axios.delete(
          `${VITE_LOCAL_BACKEND_URL}/posts/multi-delete?dates=${convertDatesArrToCsv} `,
          {
            headers: { Authorization: `Bearer ${workdiary_token}` },
          }
        );
        await dispatch(getPost(workdiary_token, currentDate));
        if (data?.posts_list?.length > 0) {
          dispatch(setPostsList(data.posts_list, data.pagination));
        } else if (data?.posts_list?.length === 0) {
          dispatch(setPostsList(null, data.pagination));
        }
      }
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function deleteTab(workdiary_token, date, tab_id) {
  return async function (dispatch) {
    try {
      const { data } = await axios.delete(
        `${VITE_LOCAL_BACKEND_URL}/tabs/delete?date=${date}&tab_id=${tab_id}`,
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      if (data.all_post_dates) {
        dispatch(setAllPostDates(data.all_post_dates));
      }
      dispatch(setPost(data.post));
      dispatch(setDate(data.date));
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

export function changeAlarm(workdiary_token, alarmChange) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${VITE_LOCAL_BACKEND_URL}/users/change-alarm`,
        { ...alarmChange },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );

      if (data.user) {
        chrome.storage.session.set({ user: data.user });
      }

      dispatch(setUserAccountInfo(data.user));
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}
export function changeOtherSettings(workdiary_token, alarmChange) {
  return async function (dispatch) {
    try {
      const { data } = await axios.post(
        `${VITE_LOCAL_BACKEND_URL}/users/other-settings`,
        { ...alarmChange },
        {
          headers: { Authorization: `Bearer ${workdiary_token}` },
        }
      );
      dispatch(setUserAccountInfo(data.user));
    } catch (error) {
      alert(error?.response?.data?.message || error?.message);
      console.log(error);
    }
  };
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const { user } = await chrome.storage.session.get(["user"]);
  if (alarm.name.startsWith("myAlarm_") && user?.alarm_status) {
    // Check for alarms with day-specific names
    console.log("fire alarm - actionCreator", alarm.name);
    // Trigger notification and reset alarm as before
    chrome.notifications.create({
      type: "basic",
      iconUrl: "w_extension.png",
      title: "Work Diary",
      message: `Reminder to write in your Work Diary`,
      // Include sound property for the sound file
    });
    await setAlarm(user);
  }
});

export async function setAlarm(user) {
  await chrome.alarms.clearAll();
  if (!user.alarm_status) return;

  // Get the current day's index
  const currentDayIndex = DAYS_OF_WEEK.indexOf(
    new Date().toLocaleString("en-us", { weekday: "short" }).toLowerCase()
  );

  // Get the current time
  const currentTime = new Date();

  // Set alarms for today and the next 6 days
  for (let i = currentDayIndex; i < currentDayIndex + 7; i++) {
    const day = DAYS_OF_WEEK[i % 7]; // Handle wrapping around to the beginning of the week
    if (user.alarm_days.find((dayObj) => dayObj.day === day && dayObj.value)) {
      // Check if the day is enabled

      // Set alarm for this day
      const nextOccurrence = new Date();
      nextOccurrence.setDate(nextOccurrence.getDate() + (i - currentDayIndex)); // Adjust for the current day

      // Set the time based on the user's specified alarm time
      nextOccurrence.setHours(user.alarm_time.split(":")[0]);
      nextOccurrence.setMinutes(user.alarm_time.split(":")[1]);
      nextOccurrence.setSeconds(0);

      // If the alarm time for today has already passed, set the alarm for the same day next week
      if (currentTime >= nextOccurrence) {
        nextOccurrence.setDate(nextOccurrence.getDate() + 7);
      }

      console.log("actionCreator", nextOccurrence, day);

      chrome.storage.session.set({ action_creator_alarm_set: true });

      chrome.alarms.create(`myAlarm_${day}`, {
        when: nextOccurrence.getTime(),
      });
    }
  }
}
const DAYS_OF_WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function setWorkdiaryToken(workdiary_token) {
  return {
    type: "SET_WORKDIARY_TOKEN",
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
export function setSearchResults(results, query, pagination) {
  return {
    type: "SET_SEARCH_RESULTS",
    results,
    query,
    pagination,
  };
}
export function halfReset() {
  return {
    type: "HALF_RESET",
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

export function setPostsList(posts_list, pagination) {
  return {
    type: "SET_POSTS_LIST",
    posts_list,
    pagination,
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

export function loggingIn(logging_in) {
  return {
    type: "LOGGING_IN",
    logging_in,
  };
}

export function setScrollTo(clicked_search_result) {
  return {
    type: "SET_SCROLL_TO",
    clicked_search_result,
  };
}

export function clearScrollTo() {
  return {
    type: "CLEAR_SCROLL_TO",
  };
}

export function setShowAllPosts(show_all_posts) {
  return {
    type: "SET_SHOW_ALL_POSTS",
    show_all_posts,
  };
}
