package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
)

var (
	instance *websocket.Conn
	upgrader = websocket.Upgrader{}
)

// WSInstance returns the current instance of the WS Connection
func WSInstance() *websocket.Conn {
	return instance
}

// ServeWs provides a route to serve WebSocket
func ServeWs(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Unable to start WebSocket server")
	}
	fmt.Println("WebSocket server initialized")
	instance = ws
}

// EventRouter provides a route to send message through WebSockets
func EventRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Println("New Event")
	var simpleMessage struct {
		Message string `json:"message"`
	}

	error := json.NewDecoder(r.Body).Decode(&simpleMessage)
	if error != nil {
		http.Error(w, "Unable to parse body", 400)
		return
	}
	if instance != nil {
		fmt.Println("Instance exists")
		instance.WriteJSON(simpleMessage)
	}
}
