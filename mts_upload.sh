
export SK_TOKEN="sk.DO_NOT_SHARE_SK_TOKENS"
export ACCOUNT="takutosuzukimapbox"

# Create high zoom level dataset
curl -X POST "https://api.mapbox.com/tilesets/v1/sources/${ACCOUNT}/wind-3000-planet-25?access_token=${SK_TOKEN}"  -F file=@wind_highzoom.geojsonld  --header "Content-Type: multipart/form-data"

curl -X POST "https://api.mapbox.com/tilesets/v1/${ACCOUNT}.wind-highzoom-planet?access_token=${SK_TOKEN}"  -d @recipe_highzoom.json  --header "Content-Type:application/json"

curl -X POST "https://api.mapbox.com/tilesets/v1/${ACCOUNT}.wind-highzoom-planet/publish?access_token=${SK_TOKEN}"  -d @recipe_highzoom.json  --header "Content-Type:application/json"

# Create mid zoom level dataset
curl -X POST "https://api.mapbox.com/tilesets/v1/sources/${ACCOUNT}/wind-20000-planet-25?access_token=${SK_TOKEN}"  -F file=@wind_midzoom.geojsonld  --header "Content-Type: multipart/form-data"

curl -X POST "https://api.mapbox.com/tilesets/v1/${ACCOUNT}.wind-midzoom-planet?access_token=${SK_TOKEN}"  -d @recipe_midzoom.json  --header "Content-Type:application/json"

curl -X POST "https://api.mapbox.com/tilesets/v1/${ACCOUNT}.wind-midzoom-planet/publish?access_token=${SK_TOKEN}"  --header "Content-Type:application/json"

# Create mid zoom level dataset
curl -X POST "https://api.mapbox.com/tilesets/v1/sources/${ACCOUNT}/wind-120000-planet-25?access_token=${SK_TOKEN}"  -F file=@wind_lowzoom.geojsonld  --header "Content-Type: multipart/form-data"

curl -X POST "https://api.mapbox.com/tilesets/v1/${ACCOUNT}.wind-lowzoom-planet?access_token=${SK_TOKEN}"  -d @recipe_lowzoom.json  --header "Content-Type:application/json"

curl -X POST "https://api.mapbox.com/tilesets/v1/${ACCOUNT}.wind-lowzoom-planet/publish?access_token=${SK_TOKEN}"  --header "Content-Type:application/json"
