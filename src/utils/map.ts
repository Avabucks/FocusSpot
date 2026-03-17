export function generateMapHTML(position: any): string {
    const MAP_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

    return (
`<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link href='https://cdn.boxicons.com/3.0.6/fonts/basic/boxicons.min.css' rel='stylesheet'>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #map { height: 100vh; width: 100vw; }
    </style>
<body>
    <div id="map"></div>

    <script>

        let map;
        let tiles;

        async function initMap(lat, lng) {

            if (map && lat && lng) {
                map.setView([lat, lng], 18);
            } else {
                if (lat && lng) {
                    map = L.map('map', {
                        zoomControl: false,
                        attributionControl: false
                    }).setView([lat, lng], 18);
                } else {
                    var map = L.map('map', {
                        zoomControl: false,
                        attributionControl: false
                    });
                    map.fitWorld();
                }

                map.setMaxBounds([
                    [-90, -180], // SW lat/lng
                    [90, 180]    // NE lat/lng
                ]);

                map.whenReady(() => {
                    map.on('moveend', () => {
                        const centerPosition = map.getCenter();
                        window.parent.postMessage(
                            JSON.stringify({ position: centerPosition }),
                            "*"
                        );
                    });
                });

                tiles = L.tileLayer("${MAP_URL}", { maxZoom: 18, minZoom: 3, noWrap: true, detectRetina: true, tileSize: 256 }).addTo(map);

            }

        }

        initMap(${position.lat}, ${position.lng});

    </script>
</body>
</html>
`)
}