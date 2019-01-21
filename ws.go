package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/julienschmidt/httprouter"
)

// WebSocketComponent represents the WebSocket Component
type WebSocketComponent struct {
	connection *websocket.Conn
	upgrader   *websocket.Upgrader
}

// NewWebSocketComponent initialize the Web Socker Server
func NewWebSocketComponent() *WebSocketComponent {
	return &WebSocketComponent{nil, &websocket.Upgrader{}}
}

// ServeWs provides a route to serve WebSocket
func (wsc *WebSocketComponent) ServeWs(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	ws, err := wsc.upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Unable to start WebSocket server")
	}
	fmt.Println("WebSocket server initialized")
	wsc.connection = ws
}

// EventRouter provides a route to send message through WebSockets
func (wsc *WebSocketComponent) EventRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fmt.Println("New Event")
	var standardMessage struct {
		Kind    string `json:"kind"`
		Message string `json:"message"`
	}

	error := json.NewDecoder(r.Body).Decode(&standardMessage)
	if error != nil {
		http.Error(w, "Unable to parse body", 400)
		return
	}
	if wsc.connection != nil {
		fmt.Println("Instance exists")
		wsc.connection.WriteJSON(standardMessage)
	}
}
