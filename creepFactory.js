/*
 * Author YUSUF KELO , yusufkel@gmail.com
 * used to create new creeps
 *
 */

var creepManager=require('creepManager');

module.exports= {
    factory:factory
}

function factory(){
    var minimumNumberOfHarvesters = 10;
    var minimumNumberOfUpgraders = 5;
    var minimumNumberOfBuilder = 2;
    var minimumNumberOfRepairers=1;
    var minimumNumberOfWallRepairers=1;

    return {
        create:create
    }

    function create(Game,spawnName){

        var game=Game;
        var spawn=game.spawns[spawnName];

        var numberofHarvesters=creepManager.manager(game,spawn).getCreepCountByRole('harvester');
        var numberofUpgraders=creepManager.manager(game,spawn).getCreepCountByRole('upgrader');
        var numberofBuilders=creepManager.manager(game,spawn).getCreepCountByRole('builder');
        var numberofRepairers=creepManager.manager(game,spawn).getCreepCountByRole('repairer');
        var numberofWallRepairers=creepManager.manager(game,spawn).getCreepCountByRole('wall_repairer');

        if (numberofHarvesters < minimumNumberOfHarvesters) {
            privateCreate(spawn,[WORK, WORK, CARRY, MOVE],  {
                role: 'harvester',
                working: false
            })
        }
        else if(numberofUpgraders<minimumNumberOfUpgraders){
            privateCreate(spawn,[WORK,WORK,CARRY,MOVE], {
                role:'upgrader',
                working:false
            })
        }
        else if(numberofRepairers<minimumNumberOfRepairers){
            privateCreate(spawn,[WORK,WORK,CARRY,MOVE], {
                role:'repairer',
                working:false
            })
        }
        else if(numberofBuilders<minimumNumberOfBuilder){
            privateCreate(spawn,[WORK,WORK,CARRY,MOVE], {
                role:'builder',
                working:false
            })
        }
        else if(numberofWallRepairers<minimumNumberOfWallRepairers){
            privateCreate(spawn,[WORK,WORK,CARRY,MOVE], {
                role:'wall_repairer',
                working:false
            })
        }

        // else {
        //     privateCreate(spawn,[WORK, CARRY, MOVE, MOVE],{
        //         role: 'upgrader',
        //         working: false
        //     })
        // }


    }

    function privateCreate(spawn,bodyparts,options){
        var name=spawn.createCreep(bodyparts,options);
        console.log(options.role+" "+"creep spawned:",name);
    }
}



