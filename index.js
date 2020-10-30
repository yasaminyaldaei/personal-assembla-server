const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require("dotenv");
const bodyParser = require('body-parser');

dotenv.config();

const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("Nothing Here...")
})

app.get('/get-app-tickets', (req, res) => {
    getAllTickets()
        .then(data => res.send(data))
        .catch(err => res.send(err))
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT || 3001}`)
})

const getAllTickets = async (page = 1) => {
    const appTicketsUrl = `https://api.assembla.com/v1/spaces/${process.env.SHOPPING_OPERATION_ID}/tags/${process.env.RELEASE_ID}/tickets.json?per_page=100&page=${page}`;
    const response = await axios({
        method: "GET",
        url: appTicketsUrl,
        headers: {
            "X-Api-Key": process.env.APP_ID,
            "X-Api-Secret": process.env.APP_SECRET,
        }
    })
    const data = response.data;

    if (data.length !== 0) {
        return data.concat(await getAllTickets(page + 1))
    } else {
        return data;
    }
}