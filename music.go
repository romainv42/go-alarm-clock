package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"path"
	"regexp"
	"strings"

	"github.com/julienschmidt/httprouter"
)

// Music is a class used to load playlist and correct routes
type Music struct {
	Configuration *Configuration
	Files         *[]string
	Current       int
}

// NewMusicComponent initiliaze the playlist loader
func NewMusicComponent(config *Configuration) *Music {
	return &Music{config, nil, 0}
}

// GetMusicRouter retrieves the current music file
func (am *Music) GetMusicRouter(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	if am.Files == nil {
		files := make([]string, 0)
		am.loadFiles(&files, am.Configuration.MusicBasePath)
		am.Files = &files
	}
	// filename := (*am.Files)[am.Current]
	// file, error := os.Open(filename)
	// if error != nil {
	// 	fmt.Printf("Unable to read file: %s\n", filename)
	// 	http.Error(w, "An error occured", 500)
	// 	return
	// }
}

func (am *Music) loadFiles(loaded *[]string, src string) {
	files, error := ioutil.ReadDir(src)
	if error != nil {
		fmt.Println("Enable to read dir")
		return
	}

	for _, f := range files {
		if f.IsDir() {
			am.loadFiles(loaded, path.Join(src, f.Name()))
			continue
		}
		regex := regexp.MustCompile("[.](mp3|ogg)$")
		if regex.MatchString(strings.ToLower(f.Name())) {
			*loaded = append(*loaded, path.Join(src, f.Name()))
		}
	}
}
