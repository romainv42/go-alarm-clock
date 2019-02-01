package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"os"
	"path"

	"github.com/julienschmidt/httprouter"
)

// Configuration of the alarm clock
type Configuration struct {
	StaticFilesPath string `json:"staticFiles"`
	MusicBasePath   string `json:"musicBasePath"`
}

func loadConfig() *Configuration {
	f, err := ioutil.ReadFile("/usr/bin/alarm/config/config.json")
	if err != nil {
		panic("Unable to read config file")
	}
	var config Configuration
	if err := json.Unmarshal(f, &config); err != nil {
		panic("Unable to parse config file")
	}
	return &config
}

func main() {
	goEnv := os.Getenv("GOENV")
	var config *Configuration
	if goEnv == "development" {
		config = &Configuration{path.Join(os.Getenv("PWD"), "assets"), "./music"}
	} else {
		config = loadConfig()
	}

	router := httprouter.New()
	ac := NewAlarmComponent()
	wsc := NewWebSocketComponent()
	mc := NewMusicComponent(config)
	sc := NewSettingsComponent()
	lc := NewLightComponent()

	router.GET("/api/alarm/:method", ac.Get)
	router.PUT("/api/alarm/:rowIndex", ac.Save)
	router.POST("/api/alarm", ac.Save)
	router.DELETE("/api/alarm/:rowIndex", ac.Delete)

	router.GET("/api/music", mc.GetMusicRouter)

	router.GET("/api/settings", sc.GetSettingsRouter)
	router.POST("/api/settings", sc.PostSettingsRouter)

	router.GET("/api/light", lc.GetLightState)
	router.POST("/api/light", lc.SaveLightState)

	router.POST("/event", wsc.EventRouter)
	router.GET("/ws", wsc.ServeWs)

	router.ServeFiles("/src/*filepath", http.Dir(config.StaticFilesPath))
	if err := http.ListenAndServe(":8081", router); err != nil {
		panic(err.Error())
	}

}
