# Ingest Add-on

This context describes the small vocabulary around capturing the current page from a client and handing it to an ingest server.

## Language

**Page Capture**:
A single user-triggered capture of a page address and lightweight page context. A **Page Capture** has exactly one **Capture Source**.
_Avoid_: Ping, bookmark, scrape

**Capture Source**:
The kind of client that produced a **Page Capture**, such as a browser extension or an automated script. Use this term when the ingest server needs to distinguish where captures came from.
_Avoid_: Sender, origin

**Delivery Result**:
The outcome reported after a client attempts to send a **Page Capture** to an ingest server. A successful **Delivery Result** means the server accepted the capture.
_Avoid_: Ping status, response state

## Example Dialogue

Developer: "Should this Page Capture include the tab title?"

Domain expert: "Yes. The browser extension should send the URL, the title, and a Capture Source that says it came from a browser."

Developer: "If an automated script sends captures later, is that still a Page Capture?"

Domain expert: "Yes, but its Capture Source should identify it as a script rather than a browser."

Developer: "How should the user know whether the capture arrived?"

Domain expert: "Show the Delivery Result. A 200 response from the server should be visible as a successful send."
