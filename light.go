package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/julienschmidt/httprouter"
	ws2811 "github.com/rpi-ws281x/rpi-ws281x-go"
)

// LightState represents currnt light state
type LightState struct {
	Value int  `json:"level"`
	On    bool `json:"isOn"`
}

const ledCount = 8 * 32

// NewLightComponent create a new LightComponent and returns its state
func NewLightComponent() *LightState {
	return &LightState{64, false}
}

// GetLightState is a router that send current Led Status
func (ls *LightState) GetLightState(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	json, error := json.Marshal(ls)
	if error != nil {
		fmt.Println("Unable to get light state")
		http.Error(w, "An error occured", 500)
		return
	}
	w.Write(json)
}

// SaveLightState is a router that send current Led Status
func (ls *LightState) SaveLightState(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var temp LightState
	if error := json.NewDecoder(r.Body).Decode(&temp); error != nil {
		fmt.Println(error.Error())
		fmt.Println("Unable to parse json")
		http.Error(w, "An error occured", 500)
		return
	}

	if os.Getenv("GOENV") == "development" {
		ls = &temp
		fmt.Println("Done")
		w.Header().Set("content-type", "application/json")
		fmt.Fprintf(w, "{ \"operation\": \"success\" }")
		return
	}

	if temp.Value != ls.Value && temp.On {
		ls.Value = temp.Value
		if error := ls.lightOn; error != nil {
			fmt.Println("Unable to change level")
			http.Error(w, "An error occured", 500)
			return
		}
	}

	if temp.On != ls.On {
		if temp.On {
			if err := ls.lightOn(); err != nil {
				fmt.Println("Unable to light on")
				http.Error(w, "An error occured", 500)
				return
			}
		} else {
			if error := ls.lightOff(); error != nil {
				fmt.Println("Unable to light off")
				http.Error(w, "An error occured", 500)
				return
			}
		}
	}
	fmt.Println("Done")
	w.Header().Set("content-type", "application/json")
	fmt.Fprintf(w, "{ \"operation\": \"success\" }")
}

func (ls *LightState) init() (*ws2811.WS2811, error) {
	opt := ws2811.DefaultOptions
	opt.Channels[0].Brightness = ls.Value
	opt.Channels[0].LedCount = ledCount
	dev, err := ws2811.MakeWS2811(&opt)
	if err != nil {
		return nil,err
	}
	return dev, dev.Init()
}

func (ls *LightState) lightOn() error {
	drv, err := ls.init()
	if err != nil {
		fmt.Println("Unable to init")
		return err
	}
	defer drv.Fini()
	for i := 0; i < ledCount; i++ {
		fmt.Println(i)
		drv.Leds(0)[i] = 0xffffff
	}
	if err := drv.Render(); err != nil {
		fmt.Println("Unable to render")
		return err
	}
	ls.On = true
	return nil
}

func (ls *LightState) lightOff() error {
	drv, err := ls.init()
	if err != nil {
		return err
	}
	defer drv.Fini()
	for i := 0; i < ledCount; i++ {
		drv.Leds(0)[i] = uint32(0x000000)
	}
	if err := drv.Render(); err != nil {
		return err
	}
	ls = &LightState{64, false}
	return nil
}
