ig.module(
	'game.entities.slime'
	)
	.requires(
		'impact.entity',
		'impact.timer',
		'game.entities.slimeblood'
		)
	.defines(function () {
		// Create your own entity, subclassed from ig.Enitity
		EntitySlime = ig.Entity.extend({
			// Set some of the properties
			collides: ig.Entity.COLLIDES.NEVER,
			type: ig.Entity.TYPE.A,
			checkAgainst: ig.Entity.TYPE.B,
			zIndex: 100,
			name: 'Slime',

			size: { x: 32, y: 16 },
			offset: { x: 0, y: 16 },
			maxVel: { x: 100, y: 1000 },
			growth: 32,

			damageCooldown: new ig.Timer(),

			gravityFactor: 1.5,

			toGrow: 0,

			jumping: false,
			eating: false,
			diving: false,

			// Load an animation sheet
			animSheet: new ig.AnimationSheet('media/Slime.png', 32, 32),

			init: function (x, y, settings) {
				this.addAnim('idle', 0.2, [0, 1, 2, 3])
				this.addAnim('jump', 0.05, [0, 4, 5, 6, 7, 8, 9])
				this.addAnim('jumping', 0.1, [8, 9])
				this.addAnim('eating', 0.05, [10, 11, 12, 13, 14, 15, 16])
				this.addAnim('diving', 0.1, [17, 18])

				this.currentAnim = this.anims.idle

				ig.input.bind(ig.KEY.UP_ARROW, 'jump')
				ig.input.bind(ig.KEY.DOWN_ARROW, 'eat')
				ig.input.bind(ig.KEY.LEFT_ARROW, 'grow')
				ig.input.bind(ig.KEY.RIGHT_ARROW, 'die')

				// Call the parent constructor
				this.parent(x, y, settings);
			},

			update: function () {
				this.offset.y = 16
				this.size.x = 32 * this.slimeScale()
				this.offset.x = 8

				if (this.pos.x < 128) {
					this.vel.x = 90
				}

				if (this.pos.x > 160) {
					this.vel.x = 70
				}

				if (this.toGrow) {
					this.grow(this.toGrow)
				}

				if (ig.input.state('grow')) {
					this.feed(1)
				}

				if (ig.input.state('die')) {
					this.feed(-1)
				}

				if (!this.jumping && !this.eating && this.standing) {
					if (ig.input.pressed('jump')) {
						this.anims.jump.rewind()
						this.jumping = true;
						this.currentAnim = this.anims.jump
					}

					if (ig.input.pressed('eat')) {
						this.anims.eating.rewind()
						this.eating = true;
						this.currentAnim = this.anims.eating
					}
				}

				if (this.jumping || !this.standing) {
					if (ig.input.pressed('eat')) {
						this.diving = true
						this.currentAnim = this.anims.diving
					} 
				}

				if (this.jumping && !this.diving) {
					if (this.currentAnim == this.anims.jump) {
						if (_.contains([8, 9], this.currentAnim.frame)) {
							this.offset.y = 0
							this.offset.x = 8
							this.size.x = 16 * this.slimeScale()
						}

						if (this.currentAnim.frame > 0) {
							this.vel.y = -(150 + (this.size.x / 32) * 25);
						}
						if (this.currentAnim.frame == this.anims.jump.sequence.length - 1) {
							this.jumping = false;
						}
					}
				} else if (this.eating) {
					if (this.currentAnim.frame == this.anims.eating.sequence.length - 1) {
						this.eating = false;
					}
				} else if (this.standing) {
					this.currentAnim = this.anims.idle
					this.diving = false
					this.jumping = false
					this.eating = false
				} else if (this.diving === true) {
					this.vel.y = 200;
				} else if (this.standing === false) {
					this.currentAnim = this.anims.jumping
				}

				this.parent();
			},

			check: function (other) {
				if ((this.eating || this.diving) && other.attacking !== true) {
					if (other.eat !== undefined) {
						other.eat(this)
					}
				}
			},

			feed: function (val) {
				// Feed it?
				this.toGrow += val
			},

			damage: function (val) {
				// 1 second cooldown on recieving damage
				if (this.damageCooldown.delta() < 1) { return }
				this.toGrow -= val
				var ent = ig.game.spawnEntity(EntitySlimeBlood, this.pos.x, this.pos.y, {})
				ent.vel.x = this.vel.x
				if (this.growth + this.toGrow < 31) {
					this.kill()
					ig.game.gameOver = true
				}
				this.damageCooldown.reset()
			},

			grow: function () {
				var val = this.toGrow
				if (val == 0) return

				this.growth += val

				this.size.x += val
				this.size.y += val

				// this.pos.x += (val * .5)
				this.pos.y -= val

				this.toGrow = 0
			},

			slimeScale: function () {
				return this.growth / 32
			},

			draw: function () {
				var ctx = ig.system.context;
				ctx.save();
				ctx.translate(ig.system.getDrawPos(this.pos.x - this.offset.x - ig.game.screen.x),
					ig.system.getDrawPos(this.pos.y - this.offset.y - ig.game.screen.y));
				ctx.scale(this.slimeScale(), this.slimeScale());
				this.currentAnim.draw(0, 0);
				ctx.restore();
			}
		});
    });