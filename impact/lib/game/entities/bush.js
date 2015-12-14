ig.module(
	'game.entities.bush'
	)
	.requires(
		'impact.entity',
		'impact.timer'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntityBush = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.NEVER,
			type: ig.Entity.TYPE.NONE,
			checkAgainst: ig.Entity.TYPE.NONE,
			zIndex: 5,
			name: 'Bush',

			size: { x: 32, y: 32 },
			offset: { x: 0, y: 0 },

			gravityFactor: 0,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Bush.png', 32, 32),

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