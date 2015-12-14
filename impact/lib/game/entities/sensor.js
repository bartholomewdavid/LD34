ig.module(
	'game.entities.sensor'
	)
	.requires(
		'impact.entity'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntitySensor = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.NEVER,
			type: ig.Entity.TYPE.NONE,
			checkAgainst: ig.Entity.TYPE.A,
			zIndex: 100,
			name: 'Sensor',
			cb: undefined,

			size: { x: 8, y: 8 },
			offset: { x: 0, y: 0 },
			gravityFactor: 1,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Sensor.png', 8, 8),

			init: function (x, y, settings) {
				// this.addAnim('idle', 0.2, [0])
				// this.currentAnim = this.anims.idle
				this.parent(x, y, settings)
				this.cb = settings.cb
				this.parent = settings.parent
			},

			update: function () {},
			check: function(other) {
				this.cb()
			}
		});
    });