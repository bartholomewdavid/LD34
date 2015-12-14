ig.module(
        'game.main'
    )
    .requires(
        'impact.game',
        'game.games.menu'
    )
    .defines(function () {
        ig.resetGame = function () {
            ig.system.setGame(MenuGame);
        };

        window.addEventListener("load", function () {
            ig.main('#canvas', MenuGame, 60, 480, 320, 2);
        });
    });
