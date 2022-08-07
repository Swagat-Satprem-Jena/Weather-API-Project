const http = require('http');
const fs = require('fs');
const requests = require('requests');
let cityName = 'bhubaneswar';

const htmlFile = fs.readFileSync('home.html', 'utf-8');

const replacePlaceHolders = (iniFile, upd) => {
    iniFile = iniFile.replace('{%location_city%}', upd.loc_city);
    iniFile = iniFile.replace('{%location_country%}', upd.loc_country);
    iniFile = iniFile.replace('{%curr_temp%}', upd.temp);
    iniFile = iniFile.replace('{%min_temp%}', upd.min_temp);
    iniFile = iniFile.replace('{%max_temp%}', upd.max_temp);
    iniFile = iniFile.replace('{%icon_url%}', upd.icon_img_url);
    return iniFile;
}

const server = http.createServer((req, res) => {
    if(req.url == '/')
    {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=4bcb723ef832f30a1ad00a86aa59cef2&units=metric`)
        .on('data', (chunk) => {
            const weatherData = JSON.parse(chunk);
            const weather = {};
            const icon_code = weatherData.weather[0].icon;
            weather.icon_img_url = "http://openweathermap.org/img/wn/" + icon_code + "@2x.png"; 
            weather.temp = weatherData.main.temp;
            weather.min_temp = weatherData.main.temp_min;
            weather.max_temp = weatherData.main.temp_max;
            weather.loc_city = weatherData.name;
            weather.loc_country = weatherData.sys.country;
            // console.log(weather.temp);
            const realTimeData = replacePlaceHolders(htmlFile, weather);
            // res.write(htmlFile);
            // console.log(realTimeData);
            // console.log(typeof(realTimeData));
            res.write(realTimeData);
        })
        .on('end', (err) => {
            if(err)
            return console.log('Connecion closed due to error : ', err);
            res.end();
        })
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('server started at port 8000.');
})