#!/bin/sh
exec chromium-browser --kiosk --app=http://localhost:8081/src --remote-debugging-port=9222 --user-data-dir=remote-profile
