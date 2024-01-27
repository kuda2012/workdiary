const config = {
  // CLOUD_BACKEND_URL: "http://localhost:3000",
  // LOCAL_BACKEND_URL: "https://be-workdiary.onrender.com",
  CLOUD_BACKEND_URL: "https://be-workdiary.onrender.com",
  LOCAL_BACKEND_URL: "http://localhost:3000",
  // Other configurations...
};

let popupWindow;

function isPopupOpen() {
  return popupWindow;
}

function togglePopup() {
  if (isPopupOpen()) {
    closePopup();
  } else {
    openPopup();
  }
}

function openPopup() {
  chrome.windows.create(
    {
      url: "index.html", // Replace with your HTML file's path
      type: "popup",
      width: 869, // Set the width and height as desired
      height: 900,
      top: 125, // Adjust the window's position as needed
      left: 490,
    },
    function (window) {
      popupWindow = window;
    }
  );
}

function closePopup() {
  if (popupWindow) {
    chrome.windows.remove(popupWindow.id, function () {
      popupWindow = undefined;
    });
  }
}

chrome.action.onClicked.addListener(function () {
  togglePopup();
});

chrome.windows.onRemoved.addListener(function (windowId) {
  if (popupWindow && popupWindow.id === windowId) {
    popupWindow = undefined;
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  async function isWorkdiaryTokenCurrent(workdiary_token) {
    try {
      const response = await fetch(
        `${config.LOCAL_BACKEND_URL}/users/check-workdiary-token`,
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

  chrome.tabs.onCreated.addListener(function (tab) {
    // Send a message to alert the extension about the new tab
    if (
      tab.pendingUrl !==
      "chrome-extension://lbjmgndoajjfcodenfoicgenhjphacmp/index.html"
    ) {
      chrome.runtime.sendMessage({ type: "newTabOpened", tab: tab });
    }
  });
  chrome.tabs.onRemoved.addListener(function (tab) {
    // Send a message to alert the extension about the new tab
    if (
      tab.pendingUrl !==
      "chrome-extension://lbjmgndoajjfcodenfoicgenhjphacmp/index.html"
    ) {
      chrome.runtime.sendMessage({ type: "tabClosed", tab: tab });
    }
  });

  chrome.windows.onFocusChanged.addListener(async (windowId) => {
    const window = windowId !== -1 ? await chrome.windows.get(windowId) : null;
    if (window && window?.type !== "popup") {
      chrome.runtime.sendMessage({
        type: "windowMoved",
        windowId: windowId,
      });
    }
  });
  await chrome.storage.local.get(["workdiary_token"]).then(async (result) => {
    const workdiaryToken =
      result?.workdiary_token && typeof result?.workdiary_token === "string"
        ? await isWorkdiaryTokenCurrent(result.workdiary_token)
        : null;
    let response = null;
    if (workdiaryToken) {
      response = await fetch(`${config.LOCAL_BACKEND_URL}/users/account-info`, {
        method: "GET",
        headers: { Authorization: `Bearer ${workdiaryToken}` },
      });
      const { user } = response ? await response.json() : null;
      if (user) {
        chrome.storage.session.set({ user });
        await setAlarm(user);
      }
    }
  });

  chrome.alarms.onAlarm.addListener(async (alarm) => {
    const { user } = await chrome.storage.session.get(["user"]);
    const { action_creator_alarm_set } = await chrome.storage.session.get([
      "action_creator_alarm_set",
    ]);
    if (
      alarm.name.startsWith("myAlarm_") &&
      user?.alarm_status &&
      !action_creator_alarm_set
    ) {
      // Check for alarms with day-specific names
      console.log("fire alarm - background.js", alarm.name);
      // Trigger notification and reset alarm as before
      chrome.notifications.create({
        type: "basic",
        iconUrl: "w_extension.png",
        title: "Work Diary",
        message: `Reminder to write in your Work Diary (click here to open app)`,
        // Include sound property for the sound file
      });
      chrome.notifications.onClicked.addListener(() => {
        openPopup();
      });
      await setAlarm(user);
    }
  });

  chrome.windows.onRemoved.addListener(function () {
    chrome.storage.session.remove("action_creator_alarm_set");
  });

  async function setAlarm(user) {
    await chrome.alarms.clearAll();
    if (!user.alarm_status) return;

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
      if (
        user.alarm_days.find((dayObj) => dayObj.day === day && dayObj.value)
      ) {
        // Check if the day is enabled

        // Set alarm for this day
        const nextOccurrence = new Date();
        nextOccurrence.setDate(
          nextOccurrence.getDate() + (i - currentDayIndex)
        ); // Adjust for the current day

        // Set the time based on the user's specified alarm time
        nextOccurrence.setHours(user.alarm_time.split(":")[0]);
        nextOccurrence.setMinutes(user.alarm_time.split(":")[1]);
        nextOccurrence.setSeconds(0);

        // If the alarm time for today has already passed, set the alarm for the same day next week
        if (currentTime >= nextOccurrence) {
          nextOccurrence.setDate(nextOccurrence.getDate() + 7);
        }
        console.log("background", nextOccurrence, day);

        chrome.alarms.create(`myAlarm_${day}`, {
          when: nextOccurrence.getTime(),
        });
      }
    }
  }
});
