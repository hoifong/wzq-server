const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


const store = require("./store");

app.get('/api/rooms/', function (req, res) {
    //  获取房间信息
    res.json(store.getRooms());
});

app.get('/api/users', function (req, res) {
    res.json(store.getUsers());
});

app.get('/api/user/:username',function (req, res) {
    const user = store.findUser(req.params.username);
    res.json({
        user: user?user.data():''
    });
});

app.post('/api/create_user',function (req, res) {
    //console.log(req.body);
    const user = store.createUser(req.body['userName']);
    if(user){
        res.json({
            user: user.data()
        });
    }else{
        res.json({
            user: ''
        });
    }
});

app.post('/api/create_room', function (req, res) {
    const user = store.findUser(req.body['userName']);
    if(user){
        res.json({
            room: store.createRoom(user).data()
        });
    }else {
        res.json({
            room: ''
        });
    }

});

app.post('/api/enter_room', function (req, res) {
    const user = store.findUser(req.body['userName']);
    const room = store.findRoom(req.body['roomId']);
    if(user&&room&&user.enterRoom(room)){
        return res.json({
            room: room.data()
        });
    }
    res.json({
        room:''
    });
});

app.post('/api/ready', function (req, res) {
    const user = store.findUser(req.body['userName']);
    res.json({
        result: user.ready()
    });
});

app.post('/api/gameover', function (req, res) {
    const room = store.findRoom(req.body['roomId']);
    res.json({
        result: room.gameOver()
    });
});

app.post('/api/move', function (req, res) {
    const user = store.findUser(req.body['userName']);
    const move = req.body['moveTo'];
    const room = user.room;
    res.json({
        result: room.addMove(user, move)
    });
});

app.post('/api/quit_room', function (req, res) {
    const user = store.findUser(req.body['userName']);
    const result = user&&user.quitRoom();
    return res.json({
        result
    });
});

app.post('/api/user_tick', function (req, res) {
    const data = req.body;
    const user = store.findUser(data['userName']);
    const reqLastTickTime = data['lastTickTime'];
    //const lastTickTime = user.lastTickTime;
    if(user&&reqLastTickTime === user.lastTickTime){
        const roomState = user.isInroom();
        const rooms = roomState?[]:store.getRooms();
        user.tickState();
        res.json({
            user: user.data(),
            rooms:rooms,
            roomState:roomState?roomState.data():''
        });
    }else {
        res.json({
            lastTickTime:reqLastTickTime
        });
    }
});

app.use(express.static('public'));


app.listen(3000, ()=>{
    console.log("app running on port 3000..");
    store.start();
});