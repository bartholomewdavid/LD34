ig.module(
	'game.entities.knight'
	)
	.requires(
		'impact.entity',
		'impact.timer',
		'game.entities.blood',
		'game.entities.sensor',
		'plugins.underscore'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntityKnight = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.NEVER,
			type: ig.Entity.TYPE.B,
			checkAgainst: ig.Entity.TYPE.A,
			zIndex: 70,
			attacking: false,
			name: 'Knight',

			size: { x: 20, y: 18 },
			offset: { x: 0, y: 10 },
			gravityFactor: 1,
			sensor: undefined,
			sensorOffset: { x: -10, y: 6},
			invul: false,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Knight.png', 20, 28),

			init: function (x, y, settings) {
				this.addAnim('idle', 0.2, [0, 1, 2, 3])
				this.addAnim('attack', 0.1, [7, 7, 4, 5, 6, 0])
				this.currentAnim = this.anims.idle
				this.parent(x, y, settings)
				this.sensor = ig.game.spawnEntity(EntitySensor, 0, 0, {cb: function() {
					this.attacking = true
					this.currentAnim = this.anims.attack
					this.invul = true
				}.bind(this), parent: this})
			},

			update: function () {
				this.vel.x = -20
				
				if (this.attacking) {
					this.vel.x = 0
					if (this.currentAnim.frame == this.anims.attack.sequence.length - 1) {
						this.attacking = false;
						this.currentAnim = this.anims.idle
					}
				}

				this.sensor.pos = { x: this.pos.x + this.sensorOffset.x, y: this.pos.y + this.sensorOffset.y }

				this.parent()
			},
			
			check: function(other) {
				if (this.attacking) {
					other.damage(3)
				}	
			},

			eat: function (slime) {
				if (this.invul) { return }
				slime.feed(.5)
				ig.game.spawnEntity(EntityBlood, this.pos.x, this.pos.y, {})
				this.kill()
			}
		});
    });