import * as phaser from "phaser"


let config = {
   type: Phaser.AUTO,
   width: 500,
   hieght: 500,
   scene: {
      preload: preload,
      create: create,
      update: update
   }
};

let game = new Phaser.Game(config);

function preload(){
   this.load.image('floor', 'assets/dungeon_floor.png')
}

function create(){
   this.add.image(config.width / 2, config.hieght / 2, 'floor')
}


