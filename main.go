package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/sunshineplan/metadata"
	"github.com/sunshineplan/utils/server"
	"github.com/vharitonsky/iniflags"
)

const api = "https://api.ipdata.co/%s?api-key=%s"

var apiKey string
var config metadata.Config
var service server.Options
var logPath string

func main() {
	self, err := os.Executable()
	if err != nil {
		log.Fatal(err)
	}

	flag.StringVar(&config.Server, "server", "", "Metadata Server Address")
	flag.StringVar(&config.VerifyHeader, "header", "", "Verify Header Header Name")
	flag.StringVar(&config.VerifyValue, "value", "", "Verify Header Value")
	flag.StringVar(&service.UNIX, "unix", "", "Server UNIX")
	flag.StringVar(&service.Host, "host", "127.0.0.1", "Server Host")
	flag.StringVar(&service.Port, "port", "12345", "Server Port")
	flag.StringVar(&logPath, "log", "", "Log Path")
	//flag.StringVar(&logPath, "log", filepath.Join(filepath.Dir(self), "access.log"), "Log Path")
	iniflags.SetConfigFile(filepath.Join(filepath.Dir(self), "config.ini"))
	iniflags.SetAllowMissingConfigFile(true)
	iniflags.Parse()

	m, err := config.Get("myip_api_key")
	if err != nil {
		log.Fatal(err)
	}
	if err := json.Unmarshal(m, &apiKey); err != nil {
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
	router.StaticFS("/static", http.Dir(filepath.Join(filepath.Dir(self), "static")))
	router.LoadHTMLGlob(filepath.Join(filepath.Dir(self), "templates/*"))

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", gin.H{"key": apiKey})
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

	log.Fatal(service.Run(router))
}
