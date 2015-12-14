ig.module('game.games.menu')
  .requires(
    'impact.game',
    'impact.font',
    'game.games.play'
    )
  .defines(function () {
    MenuGame = ig.Game.extend({
      font: new ig.Font('media/04b03_large.font.png'),
      textFont: new ig.Font('media/04b03.font.png'),
      init: function () {
        ig.input.bind(ig.KEY.UP_ARROW, 'start')
      },

      update: function () {
        if (ig.input.pressed('start')) {
          ig.system.setGame(PlayGame);
        }
        this.parent();
      },

      draw: function () {
        this.parent();
        this.font.draw('Eat the World', 10, 10, ig.Font.ALIGN.LEFT)
        this.textFont.draw('The evil king turned you into a lowly slime. Seek revenge by eating everything in his kingdom.', 10, 30, ig.Font.ALIGN.LEFT)
        this.font.draw('Press Up to start the game.', 10, ig.system.height / 2 + 20, ig.Font.ALIGN.LEFT)
        
        this.font.draw('Press Up to Jump in Game.', 10, ig.system.height / 2 + 120, ig.Font.ALIGN.LEFT)
        this.font.draw('Press Down to Eat in Game.', 10, ig.system.height / 2 + 140, ig.Font.ALIGN.LEFT)
      }
    });
  });