const express = require('express')
const Datastore = require('nedb');
const fetch = require('node-fetch')
require('dotenv').config()

const PORT = process.env.PORT

const database = new Datastore('database.db');
const formdata = new Datastore('formdata.db')
formdata.loadDatabase();
database.loadDatabase();
const app = express()
app.listen(PORT || 3000, () => console.log(`litsening at ${PORT}`))
 
app.use(express.static('public'))
app.use(express.json({limit: '1mb'}));

app.get('/api', (request, response) => {
    database.find({}, (err, data)=>{
        if(err){
            response.end();
            return
        }
        response.json(data)
    })
});

app.post('/api', (request, response) =>{
    console.log(request.body)
    const timestamp = Date.now()
    const {lat , lgn} = request.body
    database.insert({lat, lgn, timestamp})
    response.json({
        status: 'sucess',
        lat : lat, 
        lgn : lgn,
        timestamp: timestamp,
    })
})

app.post('/api1', (request, response)=>{
    console.log(request.body)
    formdata.insert(request.body)
    const senddata = request.body
    response.json(senddata)
})

app.get('/weather/:latlon', async (request, response) => {
        
        const latlon = request.params.latlon.split(',')
        console.log(latlon)
        const lat = latlon[0]
        const lon = latlon[1]
        const api_key = process.env.API_KEY
        const api_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&%20exclude=hourly,daily&appid=${api_key}`
        const fetch_res = await fetch(api_url)
        const data = await fetch_res.json()
        // console.log(data)
        response.json(data)
        })
   
