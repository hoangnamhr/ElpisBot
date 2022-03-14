// Initialize button with user's preferred color
let start = document.getElementById("start");
let end = document.getElementById("end");

var myInterval;
// When the button is clicked, inject setPageBackgroundColor into current page
start.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let selectE = document.getElementById("map");
  let mapSelected = selectE.value;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
    args: [mapSelected],
  });
});

end.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: handleClearInterval,
  });
});

function handleClearInterval() {
  clearInterval(myInterval);
  console.log("ended");
}

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor(mapSelected) {
  console.log(mapSelected, "mapSelected");
  const myIframe = document.getElementsByTagName("iframe")[0];
  if (!myIframe) return;
  let myElement =
    myIframe.contentWindow.document.getElementsByTagName("canvas")[0];
  if (!myElement) return;

  const mapConfig = {
    "1-1": [
      {
        x: 658.2,
        y: 353.6,
      },
      {
        x: 118.7,
        y: 141,
      },
      {
        x: 538.9,
        y: 197.8,
      },
      {
        x: 473.5,
        y: 132.8,
      },
    ],
    "1-2": [
      {
        x: 658.2,
        y: 353.6,
      },
      {
        x: 540.7,
        y: 198.4,
      },
      {
        x: 473.5,
        y: 132.8,
      },
    ],
    "1-3": [
      {
        x: 665.2,
        y: 352.6,
      },
      {
        x: 118.7,
        y: 141,
      },
      {
        x: 573.2,
        y: 270,
      },
      {
        x: 542,
        y: 201,
      },
      {
        x: 463.7,
        y: 177.4,
      },
    ],
    "2-1": [
      {
        x: 660.7,
        y: 356,
      },
      {
        x: 118.7,
        y: 141,
      },
      {
        x: 427.3,
        y: 224.6,
      },
      {
        x: 488.7,
        y: 286,
      },
      {
        x: 575.9,
        y: 277.6,
      },
      {
        x: 465.5,
        y: 132.8,
      },
    ],
  };

  let positions = mapConfig[mapSelected];

  myInterval = setInterval(async () => {
    for (let y = 0; y < positions.length; y++) {
      if (y == 2 && mapSelected == "2-1") {
        await new Promise((r) => setTimeout(r, 50));
      }
      const touchObj = new Touch({
        identifier: Date.now(),
        target: myElement,
        clientX: positions[y].x,
        clientY: positions[y].y,
        radiusX: 2.5,
        radiusY: 2.5,
        rotationAngle: 10,
        force: 0.5,
      });

      const touchEvent = new TouchEvent("touchstart", {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj],
        shiftKey: true,
      });

      myElement.dispatchEvent(touchEvent);

      const touchEventEnd = new TouchEvent("touchend", {
        cancelable: true,
        bubbles: true,
        touches: [touchObj],
        targetTouches: [],
        changedTouches: [touchObj],
        shiftKey: true,
      });

      myElement.dispatchEvent(touchEventEnd);
      await new Promise((r) => setTimeout(r, 50));
    }
  }, 500);
}
