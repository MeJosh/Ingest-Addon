const DEFAULT_ENDPOINT = "http://127.0.0.1:8765/capture";

const form = document.querySelector("#options-form");
const endpointInput = document.querySelector("#endpoint-url");
const restoreDefaultButton = document.querySelector("#restore-default");
const statusMessage = document.querySelector("#status");

async function loadOptions() {
  const stored = await browser.storage.local.get({ endpointUrl: DEFAULT_ENDPOINT });
  endpointInput.value = stored.endpointUrl || DEFAULT_ENDPOINT;
}

function showStatus(message) {
  statusMessage.textContent = message;
  setTimeout(() => {
    statusMessage.textContent = "";
  }, 2500);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await browser.storage.local.set({ endpointUrl: endpointInput.value.trim() });
  showStatus("Saved");
});

restoreDefaultButton.addEventListener("click", async () => {
  endpointInput.value = DEFAULT_ENDPOINT;
  await browser.storage.local.set({ endpointUrl: DEFAULT_ENDPOINT });
  showStatus("Default restored");
});

loadOptions().catch((error) => {
  console.error("Failed to load options", error);
  showStatus("Could not load saved endpoint");
});
