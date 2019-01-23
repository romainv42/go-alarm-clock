package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
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
		am.Files = am.loadFiles(am.Configuration.MusicBasePath)
		fmt.Printf("%d files added to list\n", len(*am.Files))
	}
	jsonList, error := json.Marshal(am.Files)
	if error != nil {
		fmt.Println("Unable to jsonify files")
		http.Error(w, "An error occured", 500)
		return
	}
	w.Write(jsonList)
}

func (am *Music) loadFiles(src string) *[]string {
	loaded := make([]string, 0)

	files, error := ioutil.ReadDir(src)
	if error != nil {
		fmt.Println("Unable to read dir")
		return nil
	}

	for _, f := range files {
		if f.IsDir() {
			if sub := am.loadFiles(path.Join(src, f.Name())); sub != nil {
				loaded = append(loaded, *sub...)
			}
			continue
		}

		if f.Mode()&os.ModeSymlink != 0 {
			symlink, error := os.Readlink(path.Join(src, f.Name()))
			if error == nil {
				if symsub := am.loadFiles(symlink); symsub != nil {
					sub := make([]string, 0)
					for _, s := range *symsub {
						sub = append(sub, path.Join(src, f.Name(), strings.Replace(s, symlink, "", 1)))
					}
					loaded = append(loaded, sub...)
				}
			} else {
				fmt.Println(error.Error())
			}
			continue
		}
		regex := regexp.MustCompile("[.](mp3|ogg)$")
		if regex.MatchString(strings.ToLower(f.Name())) {
			loaded = append(loaded, path.Join(src, f.Name()))
		}
	}
	return &loaded
}
