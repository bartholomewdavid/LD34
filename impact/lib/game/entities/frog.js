ig.module(
	'game.entities.frog'
	)
	.requires(
		'impact.entity',
		'impact.timer',
		'game.entities.blood',
		'plugins.underscore'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntityFrog = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.NEVER,
			type: ig.Entity.TYPE.B,
			checkAgainst: ig.Entity.TYPE.NONE,
			zIndex: 50,
			name: 'Frog',

			size: { x: 8, y: 8 },
			offset: { x: 0, y: 0 },
			gravityFactor: 1,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Frog.png', 8, 8),

			init: function (x, y, settings) {
				this.addAnim('idle', 0.2, [0, 1, 2, 3, 4, 3, 2, 1, 0, 0, 0])
				this.currentAnim = this.anims.idle
				this.parent(x, y, settings);
				this.currentAnim.gotoFrame(_.random(0,this.currentAnim.sequence.length-1))
			},

			update: function () {
				this.vel.x = -5;
				this.parent()
			},
			
			eat: function(slime) {
				slime.feed(.5)
				ig.game.spawnEntity(EntityBlood, this.pos.x, this.pos.y, {})
				this.kill()
			}
		});
    });