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
	Value  int  `json:"level"`
	On     bool `json:"isOn"`
	driver *ws2811.WS2811
	Active bool `json:"active"`
}

// Color is a struct to convert Hexadecimal value to RGB int values
type Color struct {
	R uint32
	G uint32
	B uint32
}

const ledCount = 8 * 32

// NewLightComponent create a new LightComponent and returns its state
func NewLightComponent() *LightState {
	ls := LightState{64, false, nil, false}
	if drv, err := ls.init(); err == nil {
		ls.driver = drv
		ls.Active = true
	}
	return &ls
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
	if !ls.Active {
		http.Error(w, "Inactive", 400)
		return
	}

	var temp LightState
	if err := json.NewDecoder(r.Body).Decode(&temp); err != nil {
		fmt.Println(err.Error())
		fmt.Println("Unable to parse json")
		http.Error(w, "An error occured", 400)
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
		if err := ls.lightOn(); err != nil {
			fmt.Println("Unable to change level")
			http.Error(w, "An err occured", 500)
			return
		}
	}

	if temp.On != ls.On {
		if temp.On {
			if err := ls.lightOn(); err != nil {
				fmt.Println("Unable to light on")
				http.Error(w, "An err occured", 500)
				return
			}
		} else {
			if err := ls.lightOff(); err != nil {
				fmt.Println("Unable to light off")
				http.Error(w, "An err occured", 500)
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
	opt.Channels[0].GpioPin = 12
	opt.Channels[0].Brightness = 150
	opt.Channels[0].LedCount = ledCount
	dev, err := ws2811.MakeWS2811(&opt)
	if err != nil {
		return nil, err
	}
	err = dev.Init()
	if err != nil {
		return nil, err
	}
	return dev, nil
}

func (ls *LightState) lightOn() error {
	c := ls.calcBightness(0xffffff)
	for i := 0; i < ledCount; i++ {
		ls.driver.Leds(0)[i] = c
	}
	if err := ls.driver.Render(); err != nil {
		fmt.Println("Unable to render")
		return err
	}
	ls.On = true
	return nil
}

func (ls *LightState) lightOff() error {
	for i := 0; i < ledCount; i++ {
		ls.driver.Leds(0)[i] = uint32(0x000000)
	}
	if err := ls.driver.Render(); err != nil {
		return err
	}
	ls.On = false
	ls.Value = 64
	return nil
}

func hexToColor(h uint32) *Color {
	b := h % 256
	g := (h >> 8) % 256
	r := (h >> 16) % 256
	return &Color{r, g, b}
}

func (ls *LightState) calcBightness(v uint32) uint32 {
	c := hexToColor(v)
	c.R = uint32(float32(c.R) * (float32(ls.Value) / 255))
	c.G = uint32(float32(c.G) * (float32(ls.Value) / 255))
	c.B = uint32(float32(c.B) * (float32(ls.Value) / 255))
	return colorToHex(c)
}

func colorToHex(c *Color) uint32 {
	if c == nil {
		return 0x000000
	}
	h := c.R
	h = (h << 8) + c.G
	h = (h << 8) + c.B
	return h
}
