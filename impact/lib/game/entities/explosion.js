ig.module(
	'game.entities.explosion'
	)
	.requires(
		'impact.entity',
		'impact.timer'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntityExplosion = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.NEVER,
			type: ig.Entity.TYPE.NONE,
			checkAgainst: ig.Entity.TYPE.NONE,
			zIndex: 110,
			name: 'Explosion',

			size: { x: 32, y: 32 },
			offset: { x: 0, y: 0 },

			gravityFactor: -1,

			jumping: false,
			eating: false,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Explosion.png', 32, 32),

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