from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

HOST = "0.0.0.0"
PORT = 8000


def main() -> None:
    web_root = Path(__file__).parent
    handler = lambda *args, **kwargs: SimpleHTTPRequestHandler(*args, directory=str(web_root), **kwargs)

    server = ThreadingHTTPServer((HOST, PORT), handler)
    print(f"Among Us mini-game running at http://{HOST}:{PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
