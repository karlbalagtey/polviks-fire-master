const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const compression = require("compression");

if (process.env.NODE_ENV === "production") require("dotenv").config();

const stripeRoutes = require("./routes/stripe");

const app = express();
const port = process.env.PORT || 5000;

app.use(compression);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));

    app.get('*', function(req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.get('/service-worker.js', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'service-worker.js'));
});

app.use("/payment", stripeRoutes);

app.listen(port, error => {
    if (error) throw error;
    console.log("Server running on port " + port);
});
