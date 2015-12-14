ig.module(
	'game.entities.tree'
	)
	.requires(
		'impact.entity',
		'impact.timer'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntityTree = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.NEVER,
			type: ig.Entity.TYPE.NONE,
			checkAgainst: ig.Entity.TYPE.NONE,
			zIndex: 1,
			name: 'Tree',

			size: { x: 64, y: 64 },
			offset: { x: 0, y: 0 },

			gravityFactor: 0,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Tree.png', 64, 64),

			init: function (x, y, settings) {
				this.addAnim('idle', 0.1, [0])
				this.currentAnim = this.anims.idle
				this.parent(x, y, settings);
			},

			update: function () {
				this.parent()
			}
		});
    });