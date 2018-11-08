// rooms = [
    //  存放房间状态
    /*
    {
        roomId:房间ID
        users:[
            {
                userId:用户Id
                cards:手上的牌
                state:用户状态
            }
        ],
        state:房间状态
        dizhu:地主
        order:座位
    }
     */
//];
//users = [
    //  存放用户状态
    /*
    {
        userName:
        roomId:所在房间
        lastTickTime:
    }
     */
//];
const User = require('./user');
const Room = require('./room');

module.exports = {
    rooms: [],
    users: [],

    //  新建用户
    createUser: function (username) {
        if(!this.findUser(username)){
            const new_user = new User(username);
            this.users.push(new_user);
            return new_user;
        }
        return null;
    },
    createRoom: function(user){
        user.quitRoom();
        const new_room = new Room(user);
        this.rooms.push(new_room);
        return new_room;
    },
    //  查找用户
    findUser: function (username) {
        const users = this.users;
        for(let i=0;i<users.length; i++){
            if(users[i].userName === username){
                return users[i];
            }
        }
    },
    findRoom: function(roomid){
        const rooms = this.rooms;
        for(let i=0;i<rooms.length;i++){
            if(rooms[i].roomId === roomid){
                return rooms[i];
            }
        }
    },
    deleteUser:function (user, index) {
        const users = this.users;
        if(user.isInroom()){
            user.room.deleteUser(user);
        }
        users.splice(typeof index === 'number' && index < users.length?index:users.indexOf(user), 1);
    },
    deleteRoom:function (room, index) {
        const rooms = this.rooms;
        for(let i=0; i<room.users.length;i++){
            const user = room.users[i];
            if(user){
                user.quitRoom();
            }
        }
        rooms.splice(typeof index === 'number' && index < rooms.length?index:rooms.indexOf(room), 1);
    },
    getRooms:function () {
        return this.rooms.map(function (room) {
            return room.data();
        });
    },
    getUsers:function () {
        return this.users.map(function (user) {
            return user.data();
        });
    },
    clearUser: function () {
        //  清理掉线的用户
        const users = this.users;
        const curtime = new Date().getTime();
        for (let i = 0; i < users.length; i++) {
            if(!users[i].checkState(curtime)){
                this.deleteUser(users[i], i);
                i--;
            }
        }


        //console.log("clear finished");
    },
    clearRoom:function(){
        const rooms = this.rooms;
        for (let i=0;i<rooms.length;i++){
            if(!rooms[i].checkHasMem()){
                this.deleteRoom(rooms[i], i);
                i--;
            }
        }
    },
    //  周期执行
    pirodRun: function (func, ticktime) {
        return function _func() {
            func();
            setTimeout(_func, ticktime);
        }
    },
    start: function () {
        //this.createUser('hoifong');
        this.pirodRun(this.clearRoom.bind(this), 1000)();
        this.pirodRun(this.clearUser.bind(this), 5000)();
        // const rooms = this.rooms;
        // const createRoom = this.createRoom.bind(this);
        // const createUser = this.createUser.bind(this);
        // const i=0;
        // this.pirodRun(function () {
        //     i++;
        //     createRoom(createUser('hoifong'+i));
        // }, 1200)();
    }
};