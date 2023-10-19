let windowId;
async function openPopup() {
  chrome.windows.create(
    {
      url: "index.html", // Replace with your HTML file's path
      type: "popup",
      width: 1250, // Set the width and height as desired
      height: 1000,
      top: 100, // Adjust the window's position as needed
      left: 100,
    },
    function (window) {
      windowId = window.id;
    }
  );
}

function closePopup() {
  console.log("removing");
  chrome.windows.remove(windowId, function () {
    windowId = undefined;
    console.log("should be empty1", windowId);
  });
}

chrome.action.onClicked.addListener(function () {
  console.log("onclick", windowId);
  if (!windowId) {
    openPopup();
  } else {
    closePopup();
  }
});

chrome.windows.onRemoved.addListener(function () {
  // Handle window removal here
  console.log("Popup window with ID " + windowId + " was closed.");
  windowId = undefined;
  console.log("should be empty2", windowId);

  // Perform any necessary cleanup or tasks
});
