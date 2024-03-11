import { csv2json, json2csv } from "json-2-csv"

// Public Holidays
// https://data.gov.au/data/dataset/australian-holidays-machine-readable-dataset/resource/9e920340-0744-4031-a497-98ab796633e8
const publicHolidays = "https://data.gov.au/data/api/3/action/datastore_search?resource_id=9e920340-0744-4031-a497-98ab796633e8"
// https://date.nager.at/PublicHoliday/Australia
const publicHolidays2 = "https://date.nager.at/api/v3/PublicHolidays/2024/AU"

// DigiDates.de
// Time and date calculations
// https://digidates.de/en/
const dateProgress = "https://digidates.de/api/v1/progress?start=2023-01-01&end=2023-01-31"


// QR Code Generation
// https://goqr.me/api/
const qrCodes = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=jercle"


// Realtime channels
// https://pusher.com/channels/


// Charts
// https://quickchart.io/
const quickChartqr = "https://quickchart.io/qr?text=jercle"
// Client Libraries
// Go - https://github.com/henomis/quickchart-go
// Javascript - https://github.com/typpo/quickchart-js
// Javascript - ChartJS - https://www.chartjs.org/

// ImageCharts
// https://documentation.image-charts.com/



// Network Calculator
// https://networkcalc.com/
// DNS
// https://networkcalc.com/api/docs/dns/
// DNS Lookup
const dnsLookup = "https://networkcalc.com/api/dns/lookup/example.com"
// DNS WHOIS
const whoisLookup = "https://networkcalc.com/api/dns/whois/example.com"
// Encoder
// https://networkcalc.com/api/docs/encoder/
const encodeBase64 = "https://networkcalc.com/api/encoder/This%20is%20a%20test!?encoding=base64"
const decodeBase64 = "https://networkcalc.com/api/encoder/VGhpcyBpcyBhIHRlc3Qh?encoding=base64&decode=true"
// TLS/SSL Certificate lookup
// https://networkcalc.com/api/docs/security/
const certLookup = "https://networkcalc.com/api/security/certificate/example.com"
// Subnet Calculator
// https://networkcalc.com/api/docs/subnet-calculator/
const subnetCalc = "https://networkcalc.com/api/ip/192.168.1.1/24"


// Get my IP
const myIp = "https://api.myip.com"
// https://github.com/oschwald/geoip2-golang
// https://www.maxmind.com/en/accounts/985236/geoip/downloads


// IP Info
// https://ipinfo.io/developers
// https://ipinfo.io/account/home
const myIpInfo = "https://ipinfo.io/json"
// https://ipinfo.io/144.6.169.6/json



// Google Keep API
// https://developers.google.com/keep/api/reference/rest
// https://keep.googleapis.com/$discovery/rest?version=v1
// https://github.com/googleapis/google-cloud-go
// https://cloud.google.com/go/docs/reference


// Todoist API
// https://developer.todoist.com/guides/#developing-with-todoist


// Notion API
// https://developers.notion.com/docs/getting-started
// Notion JS SDK
// https://github.com/makenotion/notion-sdk-js


// PandaDoc
// https://developers.pandadoc.com/


// Discord
// https://discord.com/developers/docs/intro
// https://github.com/bwmarrin/discordgo
// https://github.com/discordjs/discord.js


// Random Data
// https://randommer.io/randommer-api
// https://randommer.io/api/swagger-docs/index.html

// https://random-data-api.com/
// https://random-data-api.com/documentation
const randomUsers = "https://random-data-api.com/api/v2/users?size=2&is_xml=true"

// Unique Robot Avatar Generator
// https://robohash.org/


// Rapid API
// https://rapidapi.com/hub


// JSON Placeholder
// https://jsonplaceholder.typicode.com/

// Faker API
// https://fakerapi.it/en


// Watchmode
// Streaming service search
// https://api.watchmode.com/docs/
const streamingSearch = "'https://api.watchmode.com/v1/search/?apiKey=YOUR_API_KEY&search_field=name&search_value=Ed%20Wood'"


// The Movie DB
// https://developer.themoviedb.org/docs/getting-started

// Spotify
// https://developer.spotify.com/documentation/web-api


// Podcast Index
// https://podcastindex-org.github.io/docs-api/#overview--libraries

// Soccer API
// https://highlightly.net/documentation/football/
