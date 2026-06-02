# Ingest Add-on

A small Firefox extension that sends the active tab to a configurable ingest endpoint.

## Files

- `extension/` contains the Firefox add-on.
- `test_server.py` runs a lightweight local server that logs incoming captures.
- `CONTEXT.md` defines the project vocabulary.

## Run The Test Server

```sh
python3 test_server.py
```

By default it listens at:

```text
http://127.0.0.1:8765/capture
```

## Load The Firefox Extension

1. Open Firefox.
2. Go to `about:debugging#/runtime/this-firefox`.
3. Click `Load Temporary Add-on...`.
4. Select `extension/manifest.json`.
5. Pin the extension from the Firefox extensions menu.

## Configure The Endpoint

Open the extension options page and set the capture endpoint. The default is:

```text
http://127.0.0.1:8765/capture
```

Clicking the pinned button sends JSON like:

```json
{
  "url": "https://example.com/",
  "title": "Example Domain",
  "sentAt": "2026-06-01T20:50:00.000Z",
  "source": {
    "type": "browser",
    "name": "firefox-extension"
  }
}
```

The toolbar badge shows `OK` for a 2xx server response and `ERR` for failures.
