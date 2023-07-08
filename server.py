import os
import json
import asyncio
import websockets
import copy
import jsoneng


# WebSocket server instance
class Server:
    def __init__(self):
        self.json_db = jsoneng.JsonDB()
        self.connected = set()
        self.data_cache = {}

    async def handler(self, websocket, path):
        # Register.
        self.connected.add(websocket)
        try:
            # Implement communication with websocket in this loop.
            # If you want to receive messages from the websocket, you can use: await websocket.recv()
            # If you want to send messages to the websocket, you can use: await websocket.send("Your message")
            while True:
                if websocket.closed:
                    break
                await asyncio.sleep(
                    1
                )  # Check every second whether the socket is still open.

        finally:
            # Unregister.
            self.connected.remove(websocket)

    async def notify_users(self):
        """_check for changes in JSON data every 5 seconds and notify users."""
        while True:
            data = self.json_db.retrieve()
            if data != self.data_cache:
                self.data_cache = copy.deepcopy(data)
                if self.connected:  # whenever changes are detected
                    message = json.dumps(self.data_cache)
                    await asyncio.wait([user.send(message) for user in self.connected])

            print("bye")
            await asyncio.sleep(5)  # sleep for 5 seconds

    def run(self):
        loop = asyncio.get_event_loop()
        loop.run_until_complete(websockets.serve(self.handler, "localhost", 8765))
        loop.run_until_complete(self.notify_users())
        loop.run_forever()


# Run the server
if __name__ == "__main__":
    server = Server()
    server.run()
