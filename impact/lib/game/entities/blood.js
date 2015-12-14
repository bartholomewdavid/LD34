ig.module(
	'game.entities.blood'
	)
	.requires(
		'impact.entity',
		'impact.timer'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntityBlood = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.NEVER,
			type: ig.Entity.TYPE.NONE,
			checkAgainst: ig.Entity.TYPE.NONE,
			zIndex: 110,
			name: 'Blood',

			size: { x: 8, y: 8 },
			offset: { x: 0, y: 0 },

			gravityFactor: 1,

			jumping: false,
			eating: false,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Blood.png', 8, 8),

			init: function (x, y, settings) {
				this.addAnim('idle', 0.1, [0, 1, 2, 3, 4])
				this.currentAnim = this.anims.idle
				this.parent(x, y, settings);
			},

			update: function () {
				if (this.currentAnim.frame == this.anims.idle.sequence.length - 1) {
					this.kill()
				}
				this.parent()
			}
		});
    });