package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"os/exec"
	"regexp"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

// Settings represents User Settings
type Settings struct {
	Volume int `json:"volume"`
}

// NewSettingsComponent initiliaze User Settings Component
func NewSettingsComponent() *Settings {
	return &Settings{}
}

// GetSettingsRouter retrieves the current settings
func (s *Settings) GetSettingsRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	v, error := s.loadVolume()
	if error != nil {
		fmt.Println("Unable to get volume")
		http.Error(w, "An error occured", 500)
		return
	}
	s.Volume = v

	// Load Other settings
	json, error := json.Marshal(s)
	if error != nil {
		fmt.Println("Unable to get settigns")
		http.Error(w, "An error occured", 500)
		return
	}
	w.Write(json)
}

// PostSettingsRouter saves the new settings
func (s *Settings) PostSettingsRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var temp Settings
	if error := json.NewDecoder(r.Body).Decode(&temp); error != nil {
		fmt.Println(error.Error())
		fmt.Println("Unable to parse json")
		http.Error(w, "An error occured", 500)
		return
	}

	if s.Volume != temp.Volume {
		if error := s.saveVolume(temp.Volume); error != nil {
			fmt.Println("Unable to set volume")
			http.Error(w, "An error occured", 500)
			return
		}
	}
	fmt.Println("Done")
	w.Header().Set("content-type", "application/json")
	fmt.Fprintf(w, "{ \"operation\": \"success\" }")
}

func (s *Settings) loadVolume() (int, error) {
	var b []byte
	var err error
	if os.Getenv("GOENV") == "development" {
		b, err = ioutil.ReadFile("volume.txt")
		if err != nil {
			panic(err.Error())
		}
	} else {
		cmd := exec.Command("amixer", "-M", "sget", "PCM")
		b, err = cmd.Output()
	}

	str := string(b)
	regex := regexp.MustCompile("[[](\\d+)%[]]")
	m := regex.FindStringSubmatch(str)
	if len(m) != 2 {
		return 0, errors.New("Unable to parse and get Volume value")
	}
	return strconv.Atoi(m[1])
}

func (s *Settings) saveVolume(value int) error {
	//amixer -M sset PCM 40%
	if os.Getenv("GOENV") == "development" {
		s.Volume = value
		return nil
	}
	cmd := exec.Command("amixer", "-M", "sset", "PCM", fmt.Sprintf("%d%%", value))
	err := cmd.Run()
	if err != nil {
		fmt.Println("Unable to exec command crontab")
		fmt.Println(err.Error())
		return err
	}
	s.Volume = value
	return nil
}
