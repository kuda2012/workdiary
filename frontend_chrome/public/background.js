const config = {
  CLOUD_BACKEND_URL: "http://localhost:3000",
  BACKEND_URL: "https://be-workdiary.onrender.com",
  // CLOUD_BACKEND_URL: "https://be-workdiary.onrender.com",
  // BACKEND_URL: "http://localhost:3000",
  // Other configurations...
};

async function isPopupOpen() {
  const result = await chrome.storage.session.get("popup_window");
  return result?.popup_window;
}

async function togglePopup() {
  if (await isPopupOpen()) {
    closePopup();
  } else {
    openPopup();
  }
}

async function openPopup() {
  chrome.windows.getCurrent(null, async function (currentWindow) {
    const screenWidth = currentWindow.width;
    const screenHeight = currentWindow.height;

    const popupWidth = 869; // Set the width and height as desired
    const popupHeight = 900;

    const left = Math.max(0, Math.floor((screenWidth - popupWidth) / 2));
    const top = Math.max(0, Math.floor((screenHeight - popupHeight + 95) / 2));
    chrome.windows.create(
      {
        url: "index.html", // Replace with your HTML file's path
        type: "popup",
        width: popupWidth,
        height: popupHeight,
        top: top,
        left: left,
      },
      async function (window) {
        chrome.storage.session.set({ popup_window: window });
      }
    );
  });
}

async function closePopup() {
  const result = await chrome.storage.session.get("popup_window");
  if (result?.popup_window) {
    chrome.windows.remove(result?.popup_window.id, async function () {
      chrome.storage.session.remove("popup_window");
    });
  }
}

chrome.action.onClicked.addListener(async function () {
  return togglePopup();
});

chrome.windows.onRemoved.addListener(async function (windowId) {
  const result = await chrome.storage.session.get("popup_window");
  if (result?.popup_window && result?.popup_window?.id === windowId) {
    chrome.storage.session.remove("popup_window");
    chrome.storage.session.remove("action_creator_alarm");
    setUpBackground();
  }
});

async function setAlarm(user) {
  await chrome.alarms.clearAll();
  if (!user?.alarm_status) return;

  const DAYS_OF_WEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
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
      console.log("background", nextOccurrence, day);
      chrome.storage.session.set({ background_alarm: true });

      chrome.alarms.create(`myAlarm_${day}`, {
        when: nextOccurrence.getTime(),
      });
    }
  }
}
async function setUpBackground() {
  async function isWorkdiaryTokenCurrent(workdiary_token) {
    try {
      const response = await fetch(
        `${config.BACKEND_URL}/users/check-workdiary-token`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${workdiary_token}`,
          },
          body: JSON.stringify({ source: "background.js" }),
        }
      );
      const data = await response.json();
      return data.workdiary_token;
    } catch (error) {
      console.log(error);
    }
  }
  let { workdiary_token } = await chrome.storage.local.get("workdiary_token");
  workdiary_token =
    workdiary_token && typeof workdiary_token === "string"
      ? await isWorkdiaryTokenCurrent(workdiary_token)
      : null;
  let response = null;
  if (workdiary_token) {
    response = await fetch(`${config.BACKEND_URL}/users/account-info`, {
      method: "GET",
      headers: { Authorization: `Bearer ${workdiary_token}` },
    });
    const { user } = response ? await response.json() : null;
    if (user) {
      await chrome.storage.local.set({ user });
      await setAlarm(user);
    }
  }
}

setUpBackground();

chrome.notifications.onClicked.addListener(async () => {
  if (await isPopupOpen()) {
    const { popup_window } = await chrome.storage.session.get("popup_window");
    chrome.windows.update(popup_window.id, { focused: true });
    return;
  }
  return openPopup();
});
const handleAlarm = async (alarm) => {
  const { user } = await chrome.storage.local.get("user");
  const { action_creator_alarm } = await chrome.storage.session.get(
    "action_creator_alarm"
  );
  if (
    alarm.name.startsWith("myAlarm_") &&
    user?.alarm_status &&
    !action_creator_alarm
  ) {
    // Check for alarms with day-specific names
    console.log("fire alarm - background.js", alarm.name);
    // Trigger notification and reset alarm as before
    chrome.notifications.create({
      type: "basic",
      iconUrl: "./icons/icon128.png",
      title: "Workdiary",
      message: `Reminder to write in your Workdiary!`,
      // Include sound property for the sound file
    });

    await setAlarm(user);
  }
};
chrome.alarms.onAlarm.addListener(handleAlarm);
