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
