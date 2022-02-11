const express = require('express');
const app = express();

const {Tasks, db} = require('./db');

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('sql deployment on production')
});

app.post('/tasks', async(req, res) => {
    res.send(await Tasks.create(req.body));
});

app.get('/tasks', async(req, res) => {
    res.send(await Tasks.findAll());
});

app.patch('/tasks/:id', (req, res) => {
    const {name, done, priority} = req.body;

    Tasks.findOne({where: {id: req.params.id}})
    .then((task) => {
        task.update({
            name: (task.name != undefined)? name : task.name,
            done: (task.done != undefined)? done : task.done,
            priority: (task.priority != undefined)? priority: task.priority 
        })
        task.save()
        res.status(200).send(task)
    }).catch((e) => {
        res.status(500).send(e)
    });
})

app.delete('/tasks/:id', (req, res) => {
    const deleteOne = Tasks.destroy({where: {id: req.params.id}})
    res.send(deleteOne)
})

db.sync({alert: true}).then(() => {
    
    app.listen(PORT, () => console.log(`server is running on localhost://${PORT}`));
})