package main

import (
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func main() {

	//http.Handle("/", http.FileServer(http.Dir("./assets")))
	//http.HandleFunc("/api/alarm", alarm.Router)

	router := httprouter.New()
	router.GET("/api/alarm/:method", AlarmGetRouter)
	router.PUT("/api/alarm/:rowIndex", AlarmSaveRouter)
	router.POST("/api/alarm", AlarmSaveRouter)
	router.DELETE("/api/alarm/:rowIndex", AlarmDeleteRouter)
	router.ServeFiles("/src/*filepath", http.Dir("./assets"))

	router.POST("/event", EventRouter)
	router.GET("/ws", ServeWs)

	//http.HandleFunc("/ws", ServeWs)

	log.Fatal(http.ListenAndServe(":8081", router))
}
