# MQTT Telementary Exporter

Exporter for MQTT that will format all MQTT topics into a format that Prometheus can ingest which can then be used to chart information in Grafana etc.

- [Xbox Telematics](https://github.com/AceXintense/xbox-telematics)
- [Server Rack Telematics](https://github.com/AceXintense/server-rack-telematics)

# Installation
- Clone repository
- Change docker-compose.yml's environment variables to point at your MQTT instance.
- docker compose up -d
Done!
