const path = require('path');
const express = require('express');
const app = express();
const publicPath = path.join(__dirname, 'build');
const Sequelize = require("sequelize");
const jsonParser = express.json();

const sequelize = new Sequelize("toDoDB", "root", "korolik", {
    dialect: "mysql",
    port: 3307,
    host: "localhost",
    define: {
        timestamps: false
    }
});

const Task = sequelize.define('task', {
    task: {
        type: Sequelize.STRING,
        allowNull: false
    },
    idTask: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

app.use(express.static(publicPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/toDoPage', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.delete("/toDoPage/clear", function (req, res) {

    Task.destroy({
        where: {}
    }).then(() => {
        res.send("Data deleted...");
    });
});

app.delete("/toDoPage/delOneTask", jsonParser, function (req, res) {
    console.log(req.body.idTask)
    Task.destroy({
        where: {
            idTask: req.body.idTask
        }
    }).then(() => {
        res.send("Task deleted...");
    });
});

app.get("/toDoPage/tasks", jsonParser, function (req, res) {
    Task.findAll().then((data) => {
        res.json(data);
    });
});

app.post('/toDoPage/addTask', jsonParser, (req, res) => {
    console.log(req.body);
    Task.create(req.body).then(() => {
        res.send('Task added...')
    });
})

app.post('/toDoPage/update', jsonParser, (req, res) => {
    console.log(req.body);
    Task.update({ task: req.body.task }, {
        where: {
            idTask: req.body.idTask
        }
    }).then(() => {
        res.send('Task changed...')
    });
})

sequelize.sync().then(() => {
    app.listen(3000, function () {
        console.log("The server is waiting for a connection...");
    });
}).catch(err => console.log(err));

