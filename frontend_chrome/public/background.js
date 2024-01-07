const config = {
  CLOUD_BACKEND_URL: "https://be-workdiary.onrender.com",
  LOCAL_BACKEND_URL: "http://localhost:3000",
  // Other configurations...
};
// let tabId;

// function openApp() {
//   chrome.tabs.query(
//     { url: "chrome-extension://lbjmgndoajjfcodenfoicgenhjphacmp/index.html" },
//     (tabs) => {
//       if (tabs && tabs.length > 0) {
//         // If the tab is already open, set the tabId
//         tabId = tabs[0].id;
//         console.log(`Extension tab found with ID: ${tabId}`);
//       } else {
//         // If the tab is not open, create a new tab
//         chrome.tabs.create({ url: "/index.html" }, (tab) => {
//           tabId = tab.id;
//           console.log(`New tab created with ID: ${tabId}`);
//         });
//       }
//     }
//   );
// }

// function closeApp() {
//   if (tabId) {
//     chrome.tabs.remove(tabId);
//     tabId = undefined;
//     console.log(`Closed tab with ID: ${tabId}`);
//   }
// }

// chrome.action.onClicked.addListener(function () {
//   if (!tabId) {
//     openApp();
//   } else {
//     closeApp();
//   }
// });
let popupWindow;

function isPopupOpen() {
  return popupWindow && !popupWindow.closed;
}
function openPopup() {
  if (!isPopupOpen()) {
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
}

function closePopup() {
  if (popupWindow) {
    chrome.windows.remove(popupWindow.id, function () {
      popupWindow = undefined;
    });
  }
}

chrome.action.onClicked.addListener(function () {
  if (!isPopupOpen()) {
    openPopup();
  } else {
    closePopup();
  }
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
          method: "GET",
          headers: { Authorization: `Bearer ${workdiary_token}` },
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
      chrome.runtime.sendMessage(
        {
          type: "windowMoved",
          windowId: windowId,
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending message:",
              chrome.runtime.lastError.message
            );
          }
        }
      );
    }
  });
  await chrome.storage.local.get(["workdiary_token"]).then(async (result) => {
    const workdiaryToken =
      result?.workdiary_token && typeof result?.workdiary_token === "string"
        ? await isWorkdiaryTokenCurrent(result.workdiary_token)
        : null;
    if (workdiaryToken) {
      const response = await fetch(
        `${config.LOCAL_BACKEND_URL}/users/account-info`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${workdiaryToken}` },
        }
      );
      const { user } = await response.json();
      if (user) await setAlarm(user);
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
      console.log(currentTime, militaryTimeString);
      console.log(
        "from background.js",
        `Time difference in seconds: ${timeDifferenceInSeconds}`
      );
      chrome.alarms.create("myAlarm", {
        when: Date.now() + timeDifferenceInSeconds, // Set the alarm to go off in 1 second.
      });
      chrome.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === "myAlarm") {
          console.log("fire alarm - background");
          chrome.notifications.create({
            type: "basic",
            iconUrl: "w_extension.png",
            title: "Work Diary",
            message: `Reminder to write in your Work Diary (click here to open app)`,
          });
          chrome.notifications.onClicked.addListener(() => {
            openApp();
          });
        }
      });
    }
  }
});
