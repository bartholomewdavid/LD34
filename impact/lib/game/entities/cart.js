ig.module(
	'game.entities.cart'
	)
	.requires(
		'impact.entity',
		'impact.timer',
		'game.entities.explosion'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntityCart = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.ACTIVE,
			type: ig.Entity.TYPE.B,
			checkAgainst: ig.Entity.TYPE.A,
			zIndex: 80,
			name: 'Cart',

			size: { x: 36, y: 16 },
			offset: { x: 0, y: 16 },
			maxVel: {x: 1000, y: 1000},
			gravityFactor: 1,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Cart.png', 48, 32),

			init: function (x, y, settings) {
				this.addAnim('idle', 0.2, [0, 1, 2, 3, 4, 5])
				this.currentAnim = this.anims.idle
				this.parent(x, y, settings)
			},

			update: function () {
				this.vel.x = -80;
				this.parent()
			},
			
			check: function(other) {
				other.damage(5)
				ig.game.spawnEntity(EntityExplosion, this.pos.x, this.pos.y+8, {})
				this.kill()
			}
		});
    });