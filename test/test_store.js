const assert = require('assert');
const User = require('../store/user');
const Room = require('../store/room');
const store = require('../store');

describe('store', ()=>{
    describe('function test', ()=>{
        const username = 'hoifong';
        let user;
        let room;
        it('add a user by username:'+username, ()=>{
            user = store.createUser(username);
            assert.equal(1, store.getUsers().length);
        });
        it('add a user by the same username:'+username, ()=>{
            assert.equal(null, store.createUser(username));
        });
        it('add a room by user:'+username, ()=>{
            room = store.createRoom(user);
            assert.equal(1, store.rooms.length);
            assert.equal(room, user.room);
        });
        it('add a another room by user:'+username, ()=>{
            let room2 = store.createRoom(user);
            assert.equal(2, store.rooms.length);
            assert.equal(room2, user.room);
            assert.ok(!room.checkHasMem());
        });
        it('user:'+username+'enter a room and quit his room', ()=>{
            user.enterRoom(room);
            user.quitRoom();
            assert.equal(null, user.room);
            assert.ok(!room.checkHasMem());
        });
        it('delete a user :'+ username, ()=>{
            store.deleteUser(user);
            assert.equal(0, store.users.length);
            assert.ok(!room.checkHasMem());
        });
        it('delete a room :', ()=>{
            store.deleteRoom(room);
            assert.equal(1, store.rooms.length);
        });
    });
});