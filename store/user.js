//  存放用户状态
/*
{
    userName:
    roomId:所在房间
    lastTickTime:
    cards:  手上的牌
    state:  状态
}
 */

const extend = require('../lib/tools').extend;
/*
    通过filename 或json对象创建一个user
 */
function User(user) {
    if(typeof user === 'string') {
        const inf = {
            userName: user,
            room: null,
            lastTickTime: new Date().getTime()
        };
        extend(this, inf);
    }else {
        throw TypeError("type of user must be string")
    }

}

User.delayTick = 10;
User.tickTime = 1000;

/*
    检查是否在线。
 */
User.prototype.checkState = function (curtime) {
    const cls = this.constructor;
    if(typeof curtime !== 'number'){
        curtime = new Date().getTime();
    }
    return !(curtime - this.lastTickTime > cls.delayTick*cls.tickTime);
};
User.prototype.tickState = function(){
    //  ***
    return this.lastTickTime = new Date().getTime();
};
User.prototype.quitRoom = function(){
    if(this.isInroom()){
        this.room.deleteUser(this);
        this.room = null;
    }
    return true;
};
User.prototype.enterRoom = function(room){
    if(this.isInroom()){
        //  判断是否已在一个房间内。
        this.quitRoom();
    }
    if(room.addUser(this)){
        //  判断是否能加入
        this.room = room;
        return true;
    }
    return false;
};
User.prototype.isInroom = function(){
    return  this.room;
};
User.prototype.ready = function(){
    const room = this.room;
    if(room.owner === this.userName){
        return room.startGame();
    }
    return room.beReady();
};
/*
    返回当前
 */
User.prototype.data = function(){
    return {
        userName:this.userName,
        roomId:this.room ? this.room.roomId:'',
        lastTickTime:this.lastTickTime
    };
};

module.exports = User;
