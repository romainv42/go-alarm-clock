package main

import (
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"

	"github.com/romainv42/go-alarm-clock/alarm"
)

func main() {

	http.Handle("/", http.FileServer(http.Dir("./assets")))
	//http.HandleFunc("/api/alarm", alarm.Router)
	router := httprouter.New()
	router.GET("/api/alarm/:method", alarm.GetRouter)
	router.PUT("/api/alarm/:rowIndex", alarm.SaveRouter)
	router.POST("/api/alarm", alarm.SaveRouter)
	router.DELETE("/api/alarm/:rowIndex", alarm.DeleteRouter)

	router.ServeFiles("/src/*filepath", http.Dir("./assets"))

	log.Fatal(http.ListenAndServe(":8081", router))
}
