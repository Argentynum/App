//----------------------WEATHER----------------------
const options = {
    key: 'qcgSgkIasUO5PSzgw1W8O5wCmFe7BcBW',
    verbose: true,
    lat: 55,
    lon: -1,
    zoom:4,
};

//initialise the Windy API
windyInit(options, windyAPI => {
    const { map } = windyAPI;
});