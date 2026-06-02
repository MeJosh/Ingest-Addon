#!/usr/bin/env python3
"""Lightweight local ingest server for testing the Firefox add-on."""

from __future__ import annotations

import argparse
import json
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


class CaptureHandler(BaseHTTPRequestHandler):
    def do_POST(self) -> None:
        if self.path != "/capture":
            self.send_error(404, "Use POST /capture")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length)

        try:
            payload = json.loads(raw_body.decode("utf-8"))
        except json.JSONDecodeError:
            self.send_error(400, "Request body must be JSON")
            return

        received_at = datetime.now(timezone.utc).isoformat()
        print(f"[{received_at}] Page capture received", flush=True)
        print(json.dumps(payload, indent=2, sort_keys=True), flush=True)

        response = {
            "ok": True,
            "receivedAt": received_at,
        }
        body = json.dumps(response).encode("utf-8")

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/health":
            body = b'{"ok": true}\n'
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        self.send_error(404, "Use POST /capture")

    def log_message(self, format: str, *args: object) -> None:
        print(f"[server] {self.address_string()} - {format % args}", flush=True)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run a local Page Capture test server.")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind.")
    parser.add_argument("--port", default=8765, type=int, help="Port to bind.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    server = ThreadingHTTPServer((args.host, args.port), CaptureHandler)
    print(f"Listening on http://{args.host}:{args.port}/capture", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down", flush=True)
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
