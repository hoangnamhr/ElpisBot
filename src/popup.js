let start = document.getElementById("start");
let end = document.getElementById("end");
let copyAddress = document.getElementById("copy-address");

var myInterval;
start.addEventListener("click", async () => {
  start.innerHTML = "Starting...";
  start.disabled = true;

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let selectE = document.getElementById("map");
  let mapSelected = selectE.value;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
    args: [mapSelected],
  });
});

copyAddress.addEventListener("click", async () => {
  navigator.clipboard.writeText("0xb7e8efa2a7814d4328d2e71ebd73863365056f07");
  alert("Copy success: " + "0xb7e8efa2a7814d4328d2e71ebd73863365056f07");
});

end.addEventListener("click", async () => {
  start.innerHTML = "Start";
  start.disabled = false;

  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: handleClearInterval,
  });
});

function handleClearInterval() {
  clearInterval(myInterval);
}

function setPageBackgroundColor(mapSelected) {
  const myIframe = document.getElementsByTagName("iframe")[0];
  if (!myIframe) return;
  let myElement =
    myIframe.contentWindow.document.getElementsByTagName("canvas")[0];
  if (!myElement) return;
  const mapConfig = {
    "1-1": [
      {
        x: 658.5,
        y: 350,
      },
      {
        x: 632.5,
        y: 120,
      },
      {
        x: 540.5,
        y: 204,
      },
      {
        x: 452.5,
        y: 124,
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
