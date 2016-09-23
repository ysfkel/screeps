module.exports={
    weaponry:{
        towers:{
            strike_enemy_creeps:strike
        }
    }
}


function strike(room){
    var towers=getTowers(room);
    strikeEnemyFromAllTowers(towers);

}

//get all towers in the room
function getTowers(room){
    return room.find(FIND_STRUCTURES,{
            filter:(s)=>s.structureType===STRUCTURE_TOWER});
}

//Loop all towers
function strikeEnemyFromAllTowers(towers){
    for(let tower of towers){
        strikeEnemy(tower);
    }
}

//strike enemy creeps
function strikeEnemy(tower){
    var target=tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(!!target){
        tower.attack(target);
    }else{
        console.log('no target found')
    }
}