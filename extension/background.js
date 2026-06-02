const DEFAULT_ENDPOINT = "http://127.0.0.1:8765/capture";
const BADGE_CLEAR_MS = 3000;

async function getEndpoint() {
  const stored = await browser.storage.local.get({ endpointUrl: DEFAULT_ENDPOINT });
  return stored.endpointUrl || DEFAULT_ENDPOINT;
}

function buildPayload(tab) {
  return {
    url: tab.url,
    title: tab.title || "",
    sentAt: new Date().toISOString(),
    source: {
      type: "browser",
      name: "firefox-extension"
    }
  };
}

async function showBadge(tabId, text, color) {
  await browser.browserAction.setBadgeText({ tabId, text });
  await browser.browserAction.setBadgeBackgroundColor({ tabId, color });

  setTimeout(() => {
    browser.browserAction.setBadgeText({ tabId, text: "" }).catch(() => {});
  }, BADGE_CLEAR_MS);
}

async function sendCapture(tab) {
  const endpoint = await getEndpoint();
  const payload = buildPayload(tab);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return {
    endpoint,
    payload,
    status: response.status,
    ok: response.ok
  };
}

browser.browserAction.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id || !tab.url) {
    return;
  }

  try {
    const result = await sendCapture(tab);
    if (result.ok) {
      await showBadge(tab.id, "OK", "#157347");
      console.info("Page capture delivered", result);
    } else {
      await showBadge(tab.id, "ERR", "#b42318");
      console.warn("Page capture returned a non-2xx response", result);
    }
  } catch (error) {
    await showBadge(tab.id, "ERR", "#b42318");
    console.error("Page capture failed", error);
  }
});
