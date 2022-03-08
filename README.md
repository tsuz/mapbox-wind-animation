# mapbox-wind-animation
Mapbox wind animation built with MTS and GL JS (portable to mobile SDKs)

## Demo

https://jsfiddle.net/tsuzk/sg2qfx8t/show

## How data was built

The data is not in the respository so you need to run
1. `npm i`
2. `node convert.js`

which generates these files:

- `wind_highzoom.geojsonld`
- `wind_midzoom.geojsonld`
- `wind_lowzoom.geojsonld`

## How to upload to Mapbox MTS

1. [Get a Mapbox secret token][1] and set it as `SK_TOKEN` environment variable.
2. Set your account name to `ACCOUNT` environment variable.
3. Replace `takutosuzukimapbox` with your account name in the `recipe_highzoom.json`, `recipe_midzoom.json`, `recipe_lowzoom.json`.
4. Run the commands in `mts_upload.md`.

[1]: https://docs.mapbox.com/help/tutorials/get-started-mts-and-tilesets-cli/#set-your-access-token-as-an-environment-variable

## How to run on the client side

Run below and replace `takutosuzukimapbox` with your account name and replace `access_token` variable with your token.

https://jsfiddle.net/tsuzk/sg2qfx8t