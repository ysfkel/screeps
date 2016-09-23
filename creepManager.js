/*
 * Author YUSUF KELO , yusufkel@gmail.com
 * used for managing activities of active creeps
 *
 */


module.exports={
    manager:manager
}

function manager(Game,spawnName){

    var game=Game;
    var spawn=game.spawns[spawnName];

    return{
        runCreeps:runCreeps,
        clearMemory:clearMemory,
        getCreepCountByRole:getCreepCountByRole
    }
    //iterates all creeps and moves each creep to a destination based on its role
    function runCreeps(creeps){
        //for every creep name in Game.creeps
        for(let name in creeps) {
            //get the creep object
            var creep=creeps[name];
            console.log('my creep name',name)

            runCreep(creep);

        }
    }

    //moves  creep to a destination based on its role or state
    function runCreep(creep){
        creep=changeCreepState(creep);

        if (creep.memory.working === true) {

            switch(creep.memory.role)
            {
                case "harvester":{
                    moveCreepToSpawn(creep,spawn);
                    break;
                }
                case "upgrader":{
                    moveCreepToController(creep);
                    break;
                }
                case "builder":{
                    moveCreepToConstructionSite(creep);
                    break;
                }
                case "repairer":{
                    moveCreepToStructureRepairSite(creep);
                    break;
                }
                case "wall_repairer":{
                    moveCreepToWallForRepair(creep);
                    break;
                }
            }

        }else{
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            moveCreepToEnergySource(creep,source)
        }
    }

    //moves creep to spawn or tower or extennsion
    function moveCreepToSpawn(creep){
        //find closest structure that can store energy e.g extension or spawn
        var structure=creep.pos.findClosestByPath(FIND_MY_STRUCTURES,{
                filter:(s)=>(
            s.structureType==STRUCTURE_SPAWN
            ||   s.structureType===STRUCTURE_TOWER
            || s.structureType===STRUCTURE_EXTENSION)
            && s.energy<s.energyCapacity
    });

        //if one structure is found
        if(structure !=undefined){
            //check if creep is working, if true transfer energy to spawn
            //check if creep is adjacent to the spawn
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                //make creep move towards the spawn
                creep.moveTo(structure);
            }
        }
    }
    //moves creep to energy source
    function moveCreepToEnergySource(creep,source){
        //if creep is not working find closest energy source
        //check if creep can harvest energy, if not, make creep move towards engergy
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }

    }
    //moves creep to controller
    function moveCreepToController(creep){
        if(creep.upgradeController(creep.room.controller)==ERR_NOT_IN_RANGE){
            //make creep move towards the controller
            creep.moveTo(creep.room.controller);
        }
    }
    //moves creep to a contruction site
    function moveCreepToConstructionSite(creep){
        var constructionSite=creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        //if there is a construction site
        if(constructionSite !=undefined){
            if(creep.build(constructionSite)==ERR_NOT_IN_RANGE){
                creep.moveTo(constructionSite)
            }
        }else{
            //else creep should upgrade controller
            moveCreepToController(creep);
        }
    }
    //moves creep to structure that requires repoair apart from walls
    function moveCreepToStructureRepairSite(creep){

        var structure=creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter:(s)=>s.hits<s.hitsMax && s.structureType !=STRUCTURE_WALL
    });

        if(structure!=undefined){
            if(creep.repair(structure)==ERR_NOT_IN_RANGE){
                creep.moveTo(structure);
            }
        }else{
            moveCreepToConstructionSite(creep);
        }
    }

    //moves creep to walls that require repair otherwise contruction site
    function moveCreepToWallForRepair(creep){
        //get all walls
        var walls=creep.pos.findClosestByPath(FIND_STRUCTURES,{
                filter:(s)=>s.structureType ===STRUCTURE_WALL
    });

        var targetWall=getWallToRepair(walls,creep);

        if(targetWall!=undefined){
            moveCreepToRepairTarget(creep,targetWall);
        }
        else{
            moveCreepToConstructionSite(creep);
        }
    }

    //moves creep to walls that require repair
    function moveCreepToRepairTarget(creep,target){
        if(creep.repair(target)==ERR_NOT_IN_RANGE){
            creep.moveTo(target);
        }
    }

    //iterate walls and get wall to repair
    function getWallToRepair(walls,creep){
        var target=undefined;

        for(let percentage=0.0001;percentage<=1;percentage=percentage+0.0001){
            target=creep.pos.findClosestByPath(walls,{
                    filter:(w)=>w.hits/w.hitsMax<percentage
        });

            if(target!=undefined){
                break;
            }
        }

        return target;
    }

    //changes the state of the creep
    function changeCreepState(creep){
        if (creep.memory.working === true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        //check if creep has harvested enough energy, if true, creep working to true , so the creep carries energy to spawn
        else if (creep.memory.working === false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        return creep;
    }

    //clears memory
    function clearMemory(creepsInMemory,creepsInGame){
        for(let name in creepsInMemory){
            if(creepsInGame[name]===undefined){
                delete creepsInMemory[name];
            }
        }
    }
    function getCreepCountByRole(roleName) {
        return _.sum(Game.creeps,(c)=>c.memory.role===roleName);
    }
}



