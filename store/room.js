/*
    {
        roomId:房间ID
        users:[
            user1,2,3
        ],
        state:房间状态
        dizhu:地主
    }
     */
const extend = require('../lib/tools').extend;

Room.STATES = {
    WAITING:'WAITING',
    READY:'READY',
    GAMIMG:'GAMING',
};
Room.MAX_SEATS = 2;
/*
    user->新建房间
 */
function Room(inf) {
    if('userName' in inf){
        //  user创建房间
        const roominf = {
            roomId: new Date().getTime(),
            users: [null,null],
            state:Room.STATES.WAITING,
            dizhu:0,
            owner: '',
            records:[],
        };
        extend(this, roominf);
        inf.enterRoom(this);
        this._setOwner(inf.userName);
    }else {
        throw TypeError("type of inf must be a user");
    }
}

Room.prototype.deleteUser = function(user){
    const idx = this.users.indexOf(user);
    if(idx!==-1){
        this.users[idx] = null;
        this.state = Room.STATES.WAITING;
        if(this.owner === user.userName){
            this._setOwner();
        }
    }

};

Room.prototype.empty = function(){
    if(this.checkHasMem()){
        this.users = [];
    }
};

Room.prototype.addUser = function (user) {
    const users = this.users;
    for(let i=0;i<Room.MAX_SEATS;i++){
        if(!users[i]){
            users[i] = user;
            return true;
        }
    }
    return false;
};

Room.prototype.data = function () {
    const records = this.records;
    return {
        roomId:this.roomId,
        users:this.users.map(function (user) {
            if(user){
                return user.userName;
            }
            return '';
        }),
        state:this.state,
        dizhu:this.dizhu.userName,
        owner:this.owner,
        move:records?records[records.length-1]:''
    }
};

Room.prototype.checkHasMem = function () {
    return this.users.some(function (user) {
        return user;
    });
};

Room.prototype.beReady = function(){
    this.state = this.state === Room.STATES.READY?Room.STATES.WAITING:Room.STATES.READY;
    return true;
};

Room.prototype.startGame = function(){
    if(this.state === Room.STATES.READY){
        this.state = Room.STATES.GAMIMG;
        this.records = [];
        return true;
    }
    return false;
};

Room.prototype.gameOver = function(){
    this.state = Room.STATES.WAITING;
    this.records = [];
    return true;
};

Room.prototype.addMove = function(user, move){
    const isBlackSide = this.users[0] === user;
    const shouldBlackMove = this.records.length%2===0;
    if(this.state!==Room.STATES.GAMIMG||isBlackSide^shouldBlackMove)return false;
    this.records.push(move);
    return true;
};

Room.prototype._setOwner = function(userName){
    if(typeof userName === "string"){
        this.owner = userName;
    }else {
        for(let i=0;i<this.users.length;i++){
            if(this.users[i]){
                this.owner = this.users[i].userName;
                break;
            }
        }
    }
};

module.exports = Room;