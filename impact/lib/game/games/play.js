ig.module(
  'game.games.play'
  )
  .requires(
    'impact.game',
    'impact.font',
    'impact.timer',
    'game.entities.slime',
    'game.entities.frog',
    'game.entities.knight',
    'game.entities.tree',
    'game.entities.cart',
    'game.entities.bush',
    'plugins.underscore'
    )
  .defines(function () {
    // The Backdrop image for the game, subclassed from ig.Image
    // because it needs to be drawn in it's natural, unscaled size, 
    FullsizeBackdrop = ig.Image.extend({
      resize: function () { },
      draw: function () {
        if (!this.loaded) { return; }
        ig.system.context.drawImage(this.data, 0, 0);
      }
    });

    PlayGame = ig.Game.extend({
      font: new ig.Font('media/04b03_large.font.png'),
      backdrop: new FullsizeBackdrop('media/Background.png'),
      timer: new ig.Timer(),
      backdropFilter: new FullsizeBackdrop('media/BackgroundFilter.png'),
      slime: null,
      gravity: 240,
      clearColor: undefined,
      spawnQueue: undefined,
      spawnCounter: 0,
      platforms: undefined,
      level: undefined,
      levelTimer: new ig.Timer(),
      nextLevel: true,
      gameOver: false,

      init: function () {
        this.map = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
        ];
        this.fluffMap = [
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
          [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
        ];

        this.backgroundMaps = []
        this.collisionMap = []
      
        // The map is used as CollisionMap AND BackgroundMap
        this.collisionMap = new ig.CollisionMap(16, this.map)
        var bgmap = new ig.BackgroundMap(16, this.map, 'media/Tiles.png')
        bgmap.foreground = false
        var bgfluffmap = new ig.BackgroundMap(16, this.fluffMap, 'media/TileFluff.png')
        bgfluffmap.foreground = true
        this.backgroundMaps.push(bgmap)
        this.backgroundMaps.push(bgfluffmap)
        this.clearColor = 'rgba(0, 0, 0, 0.1)'
        this.gameOver = false
        this.generateQueue()
        this.level = 1
        this.platforms = []

        _.each(this.entities, function (ent) {
          ent.kill()
        })

        this.slime = ig.game.spawnEntity(EntitySlime, 32, (this.map.length - 4) * 16, {});
        this.timer.reset()
      },

      update: function () {
        if (!this.gameOver) {
          this.screen.x += (70 * this.timer.delta());
          this.timer.reset()
        } else {
          if (ig.input.pressed('jump')) {
            this.init()
            return
          }
        }

        if (this.screen.x > 32) {
          this.screen.x = this.screen.x - 32; // Compensate for pop and push
  
          for (var i = 0; i < this.entities.length; i++) {
            this.entities[i].pos.x -= 32;
          }

          this.addRow()
          if (!this.nextLevel) {
            this.spawnCounter++
            if (this.spawnCounter >= 5) {
              this.spawningProcedure()
              this.spawnCounter = 0
            }
          }
        }

        this.parent()

        for (var i = 0; i < this.entities.length; i++) {
          var ent = this.entities[i]
          if (ent.pos.x < -64) {
            ent.kill()
          }
        }
      },

      generatePlatform: function () {
        var heights = _.pluck(this.platforms, 'index')
        // First two rows are used
        var pHeight = _.random(2, this.map.length)
        var pLength = _.random(2, 10)
        var pVal = 1;

        this.platforms.push({
          'index': pHeight,
          'length': pLength,
          'val': pVal
        })
      },

      spawningProcedure: function () {
        var instructions = this.spawnQueue.pop()
        if (instructions !== undefined) {
          while (instructions.length) {
            var instruction = instructions.shift()
            ig.game.spawnEntity(instruction[0], instruction[1], instruction[2], instruction[3])
          }
          
          ig.game.sortEntities()
        } else {
          // Next level?
          this.level++
          this.levelTimer.reset()
          this.nextLevel = true
        }
      },

      addRow: function () {
        for (var i = 0; i < this.collisionMap.data.length; i++) {
          var cRow = this.collisionMap.data[i]
          var bRow = this.backgroundMaps[0].data[i]
          var val = (i != this.collisionMap.data.length - 1) ? 0 : 1
          cRow.push(val)
          cRow.shift()
          bRow.push(val)
          bRow.shift()
        }
      },

      draw: function () {
        this.backdrop.draw()
        this.backdropFilter.draw()
        this.parent()

        if (this.gameOver === false) {
          this.font.draw("Size: " + (this.slime.growth - 30), 10, 10, ig.Font.ALIGN.LEFT)

          if (this.levelTimer.delta() < 5 && this.nextLevel) {
            this.font.draw("Level " + this.level, ig.system.width / 2, ig.system.height / 2, ig.Font.ALIGN.CENTER)
          } else if (this.nextLevel) {
            this.nextLevel = false;
            this.generateQueue()
          }
        } else {
          this.clearColor = 'rgba(0,0,0,0.7)'
          ig.system.clear()
          this.font.draw('Eat the World - Level ' + this.level, 10, 10, ig.Font.ALIGN.LEFT)
          this.font.draw('The evil king got the best of you. \nAre you okay with that?', 10, 30, ig.Font.ALIGN.LEFT)
          this.font.draw('Press Up to return to menu.', 10, ig.system.height / 2 + 20, ig.Font.ALIGN.LEFT)
        }
      },

      generateQueue: function () {
        var self = this
        this.spawnQueue = []
        for (var i = 0; i < 10 + this.level; i++) {
          var list = []
          var requiredVeg = _.random(4, 8)

          for (var j = 0; j < _.random(1, 3); j++) {
            list.push([EntityTree, (_.random(0, 16 * 5)) + (this.map[0].length) * 16, ((this.map.length - 5) * 16), {}])
          }
          
          for (var j = 0; j < requiredVeg - list.length; j++) {
            list.push([EntityBush, (_.random(0, 16 * 5)) + (this.map[0].length) * 16, ((this.map.length - 3) * 16), {}])
          }

          if (_.random(1, 2 + (this.level / 5)) == 1) {
            //Cart
            list.push([EntityCart, (_.random(0, 16 * 5)) + (this.map[0].length - 4) * 16, ((this.map.length - 5) * 16), {}])
          }

          var maxFrogs = (this.level < 5) ? 2 : 1
          for (var j = 0; j < _.random(0, maxFrogs); j++) {
            //Frog
            list.push([EntityFrog, (_.random(0, 16 * 5)) + (this.map[0].length - 4) * 16, ((this.map.length - 5) * 16), {}])
          }

          for (var j = 0; j < _.random(0, 2 + (this.level / 7)); j++) {
            //Frog
            list.push([EntityKnight, (_.random(0, 16 * 5)) + (this.map[0].length - 4) * 16, ((this.map.length - 5) * 16), {}])
          }

          this.spawnQueue.push(list)
        }
      }
    });
  });