let windowId;
async function openPopup() {
  chrome.windows.create(
    {
      url: "index.html", // Replace with your HTML file's path
      type: "popup",
      width: 800, // Set the width and height as desired
      height: 980,
      top: 200, // Adjust the window's position as needed
      left: 200,
    },
    function (window) {
      windowId = window.id;
    }
  );
}

function closePopup() {
  chrome.windows.remove(windowId, function () {
    windowId = undefined;
  });
}

chrome.action.onClicked.addListener(function () {
  if (!windowId) {
    openPopup();
  } else {
    closePopup();
  }
});

chrome.windows.onRemoved.addListener(function () {
  // Handle window removal here
  windowId = undefined;

  // Perform any necessary cleanup or tasks
});

chrome.runtime.onInstalled.addListener(async () => {
  async function isWorksnapTokenCurrent(worksnap_token) {
    try {
      const response = await fetch(
        "http://localhost:3000/users/check-worksnap-token",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${worksnap_token}` },
        }
      );
      const data = await response.json();
      return data.worksnap_token;
    } catch (error) {
      console.log(error);
    }
  }
  await chrome.storage.local.get(["worksnap_token"]).then(async (result) => {
    const worksnapToken = result?.worksnap_token
      ? await isWorksnapTokenCurrent(result.worksnap_token)
      : null;
    if (worksnapToken) {
      const response = await fetch("http://localhost:3000/users/account-info", {
        method: "GET",
        headers: { Authorization: `Bearer ${worksnapToken}` },
      });
      const { user } = await response.json();
      await setAlarm(user);
    }
  });

  async function setAlarm(user) {
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
      chrome.alarms.create("myAlarm", {
        when: Date.now() + timeDifferenceInSeconds, // Set the alarm to go off in 1 second.
      });
      chrome.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === "myAlarm") {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "w_extension.png",
            title: "Worksnap",
            message: `Reminder to log in your Work Diary (click here to open app)`,
            // Include sound property for the sound file
          });
          chrome.notifications.onClicked.addListener(() => {
            openPopup();
          });
        }
      });
    }
  }
});
