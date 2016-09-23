var creepManager=require('creepManager');
var creepFactory=require('creepFactory');
var utillity=require('utillity');

module.exports.loop=function(){
    var spawn='Spawn1';
    var room_name='E58N15';
    var room=Game.rooms[room_name];


    //gets the creep manager object
    var manager=creepManager.manager(Game,spawn);
    //clears memory
    manager.clearMemory(Memory.creeps,Game.creeps);
    //runs all creeps
    manager.runCreeps(Game.creeps);
    //spawns a  creep
    creepFactory.factory().create(Game,spawn);
    //strikes at enemy creeps from the towrs
    utillity.weaponry.towers.strike_enemy_creeps(room);


}
