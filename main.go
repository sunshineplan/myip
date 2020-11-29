package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/sunshineplan/utils/httpsvr"
	"github.com/sunshineplan/utils/metadata"
	"github.com/vharitonsky/iniflags"
)

const api = "https://api.ipdata.co/%s?api-key=%s"

var apiKey string
var meta metadata.Server
var server httpsvr.Server
var logPath string

func main() {
	self, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}

	flag.StringVar(&meta.Addr, "server", "", "Metadata Server Address")
	flag.StringVar(&meta.Header, "header", "", "Verify Header Header Name")
	flag.StringVar(&meta.Value, "value", "", "Verify Header Value")
	flag.StringVar(&server.Unix, "unix", "", "Server UNIX")
	flag.StringVar(&server.Host, "host", "127.0.0.1", "Server Host")
	flag.StringVar(&server.Port, "port", "12345", "Server Port")
	flag.StringVar(&logPath, "log", "", "Log Path")
	//flag.StringVar(&logPath, "log", filepath.Join(filepath.Dir(self), "access.log"), "Log Path")
	iniflags.SetConfigFile(filepath.Join(filepath.Dir(self), "config.ini"))
	iniflags.SetAllowMissingConfigFile(true)
	iniflags.Parse()

	if err := meta.Get("myip_api_key", &apiKey); err != nil {
		log.Fatal(err)
	}

	if logPath != "" {
		f, err := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0640)
		if err != nil {
			log.Fatalln("Failed to open log file:", err)
		}
		gin.DefaultWriter = f
		gin.DefaultErrorWriter = f
		log.SetOutput(f)
	}

	router := gin.Default()
	server.Handler = router
	router.StaticFS("/js", http.Dir(filepath.Join(filepath.Dir(self), "dist/js")))
	router.StaticFS("/css", http.Dir(filepath.Join(filepath.Dir(self), "dist/css")))
	router.LoadHTMLFiles(filepath.Join(filepath.Dir(self), "dist/index.html"))

	router.GET("/", func(c *gin.Context) {
		if _, err := c.Cookie("api-key"); err != nil {
			c.SetCookie("api-key", apiKey, 0, "", "", false, false)
		}
		c.HTML(200, "index.html", nil)
	})

	router.GET("/query", func(c *gin.Context) {
		query := c.DefaultQuery("ip", "")
		if query == "" {
			query = c.ClientIP()
		} else {
			ip, err := net.LookupIP(query)
			if err != nil {
				c.JSON(400, gin.H{"message": err.Error()})
				return
			}
			query = ip[0].String()
		}
		resp, err := http.Get(fmt.Sprintf(api, query, apiKey))
		if err != nil {
			c.JSON(500, gin.H{"message": err.Error()})
			return
		}
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			c.JSON(500, gin.H{"message": err.Error()})
			return
		}
		c.Data(resp.StatusCode, "application/json", body)
	})

	if err := server.Run(); err != nil {
		log.Fatal(err)
	}
}
