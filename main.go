package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

// Configuration of the alarm clock
type Configuration struct {
	MusicBasePath string `json:"musicBasePath"`
}

func loadConfig() *Configuration {
	f, err := ioutil.ReadFile("config/config.json")
	if err != nil {
		fmt.Println("Unable to read config file")
		return nil
	}
	var config Configuration
	if err := json.Unmarshal(f, &config); err != nil {
		fmt.Println("Unable to parse config file")
	}
	return &config
}

func main() {

	config := loadConfig()

	router := httprouter.New()
	wsc := NewWebSocketComponent()
	ac := NewAlarmComponent()
	am := NewMusicComponent(config)

	router.GET("/api/alarm/:method", ac.Get)
	router.PUT("/api/alarm/:rowIndex", ac.Save)
	router.POST("/api/alarm", ac.Save)
	router.DELETE("/api/alarm/:rowIndex", ac.Delete)

	router.GET("/api/music", am.GetMusicRouter)

	router.POST("/event", wsc.EventRouter)
	router.GET("/ws", wsc.ServeWs)

	router.ServeFiles("/src/*filepath", http.Dir("./assets"))

	log.Fatal(http.ListenAndServe(":8081", router))
}
