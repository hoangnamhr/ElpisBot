let start = document.getElementById("start");
let end = document.getElementById("end");
let copyAddress = document.getElementById("copy-address");

var myInterval;
start.addEventListener("click", async () => {
  start.innerHTML = "Starting...";
  start.disabled = true;
  performance = 10;
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let selectE = document.getElementById("map");
  let mapSelected = selectE.value;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: startGame,
    args: [mapSelected, start],
  });
});

copyAddress.addEventListener("click", async () => {
  navigator.clipboard
    .writeText("0xb7e8efa2a7814d4328d2e71ebd73863365056f07")
    .then(
      function () {
        alert("Copy success: " + "0xb7e8efa2a7814d4328d2e71ebd73863365056f07");
      },
      function () {
        alert("Copy failed");
      }
    );
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

function startGame(mapSelected) {
  const myIframe = document.getElementsByTagName("iframe")[0];
  if (!myIframe) return;
  let myElement =
    myIframe.contentWindow.document.getElementsByTagName("canvas")[0];
  if (!myElement) return;
  const mapConfig = {
    "1-1": [
      {
        x: 656.5,
        y: 351.3,
      },
      {
        x: 584.5,
        y: 91.3,
      },
      {
        x: 540.5,
        y: 203.3,
      },
      {
        x: 456.5,
        y: 131.3,
      },
    ],
    "1-3": [
      {
        x: 668.5,
        y: 349.3,
      },
      {
        x: 641.8,
        y: 137.3,
      },
      {
        x: 577.8,
        y: 280,
      },
      {
        x: 444.2,
        y: 214.2,
      },
      {
        x: 535.1,
        y: 198.6,
      },
      {
        x: 472.5,
        y: 172,
      },
    ],
    "1-4": [
      {
        x: 665.0,
        y: 350.8,
      },
      {
        x: 656.5,
        y: 128.9,
      },
      {
        x: 436.7,
        y: 277.2,
      },
      {
        x: 570.1,
        y: 283.6,
      },
      {
        x: 457.0,
        y: 226,
      },
      {
        x: 550.9,
        y: 202.5,
      },
      {
        x: 461.3,
        y: 231.3,
      },
    ],
    "2-1": [
      {
        x: 659.7,
        y: 350,
      },
      {
        x: 621.3,
        y: 111.0,
      },
      {
        x: 455.9,
        y: 206,
      },
      {
        x: 492.2,
        y: 279.6,
      },
      {
        x: 578.6,
        y: 279.6,
      },
      {
        x: 463.4,
        y: 135.6,
      },
    ],
  };
  let positions = mapConfig[mapSelected];

  myInterval = setInterval(async () => {
    for (let y = 0; y < positions.length; y++) {
      if (y == 2) {
        await new Promise((r) => setTimeout(r, 20));
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
      await new Promise((r) => setTimeout(r, 150));
    }
  }, 900);
}
