classes.sprites.Beaver = cc.Sprite.extend({
	_id: 0,
	_startFlag: false,
    _texture: null,
    _leftKeyDown: false,
    _rightKeyDown: false,
    _vector: new cc.kmVec2(),
    _currentAngle: 0,
    _body: null,
    ctor: function (layer, p, id) {
        this._super();
        this._id = id;
        this.initWithFile(s_beaver);
        this.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
        this._texture = cc.Sprite.createWithTexture(this.getTexture()); //second argument cc.rect(px,py,w,h)
        this.addBeaverWithCoords(layer.world, p);
        layer.addChild(this._texture, 0);
    },
    addBeaverWithCoords: function (world, p) {
        var tex = this._texture;
        tex.setPosition(p.x, p.y);

        // Define the dynamic body.
        var b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2Body = Box2D.Dynamics.b2Body,
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
            b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.Set(p.x / PTM_RATIO, p.y / PTM_RATIO);
        bodyDef.userData = tex;
        var body = world.CreateBody(bodyDef);

        // Define another box shape for our dynamic body.
        var dynamicBox = new b2PolygonShape();
        dynamicBox.SetAsBox(tex.getTextureRect().width / (PTM_RATIO*2), tex.getTextureRect().height / (PTM_RATIO*2));

        // Define the dynamic body fixture.
        var fixtureDef = new b2FixtureDef();
        fixtureDef.shape = dynamicBox;
        fixtureDef.density = 0;
        fixtureDef.friction = 0;
        body.CreateFixture(fixtureDef);
        
        this._body = body;
    },
    update: function () {
    	if(this._startFlag)
        	this._move();
        if (this._leftKeyDown || this._rightKeyDown)
        {
        	if(!this._startFlag) 
        		this._startFlag = true;
        	this._turn();
        }
    },
    handleKeyDown: function (e) {
    	console.log("keyDown!");
        if (!this._leftKeyDown || !this._rightKeyDown) {
            if (e === cc.KEY.left) this._leftKeyDown = true;
            else if (e === cc.KEY.right) this._rightKeyDown = true;
        }
    },
    handleKeyUp: function () {
    	console.log("keyUp!");
        this._leftKeyDown = false;
        this._rightKeyDown = false;
    },
    _turn: function () {
        //var curVector = this._vector; //TODO: reference TEST!
        if (this._leftKeyDown) this._currentAngle-=5, this._body.SetAngle(this._currentAngle*(Math.PI/180));
        if (this._rightKeyDown) this._currentAngle+=5, this._body.SetAngle(this._currentAngle*(Math.PI/180));
		if(this._currentAngle < 0) this._currentAngle = 355;
		if(this._currentAngle > 360) this._currentAngle = 5;
        this._vector = new Box2D.Common.Math.b2Vec2();
        this._vector.x = 5*Math.cos(-this._currentAngle*(Math.PI/180));
        this._vector.y = 5*Math.sin(-this._currentAngle*(Math.PI/180));
        console.log(" a: "+this._currentAngle+" vx: "+this._vector.x+" vy: "+this._vector.y);
        },
    _move: function () {
        var that = this;
        this._body.SetLinearVelocity(this._vector);
        this._body.SetAwake(true);
    }
});



// this._currentRotation--;
// this.runAction(cc.Sequence.create(
// cc.MoveBy.create(0.01, cc.p(-10, 0)),
// cc.CallFunc.create(function() {
// that.setScaleX(0.5);
// that.setScaleY(2.0);
// }),
// cc.DelayTime.create(0.5),
// cc.CallFunc.create(this.beFreak, this)
// ));
// this.setScaleX(0.5);
// this.setScaleY(2.0);	 

// handleTouch:function(touchLocation)
// {
// if(touchLocation.x < 300)
// this._currentRotation = 0;
// else
// this._currentRotation = 180;
// },
// handleTouchMove:function(touchLocation){
// // Gross use of hardcoded width,height params.
// var angle = Math.atan2(touchLocation.x-300,touchLocation.y-300);
// 
// angle = angle * (180/Math.PI);
// this._currentRotation = angle;
// 
// },
// beFreak: function() {
// this.setScaleX(1.0);
// this.setScaleY(1.0);
// }