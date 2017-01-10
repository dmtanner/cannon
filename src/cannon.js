var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);


var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());

    var createBox = function() {
        var box = BABYLON.Mesh.CreateBox("crate", 2, scene);
        box.material = new BABYLON.StandardMaterial("Mat", scene);
        
        box.material.diffuseTexture = new BABYLON.Texture("textures/crate.png", scene);
        //box.material.diffuseTexture.hasAlpha = true;
        box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1, 
                        friction: 0.3, restitution: 0.5 });
        
        return box;
    }

    var createCannonball = function() {
        var ball = BABYLON.Mesh.CreateSphere("ball", 10, 1, scene);
        ball.material = new BABYLON.StandardMaterial("Mat", scene);
        ball.setPhysicsState(BABYLON.PhysicsEngine.SphereImpostor, { mass: 1, 
                        friction: 0.3, restitution: 0.5 });
        
        return ball;
    }

    // Lights
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(5, 5, 5), scene);
    var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(-5, -5, -5), scene);
    var light2 = new BABYLON.DirectionalLight("directionallight", new BABYLON.Vector3(-1, -1, 1), scene);

    var cam = new BABYLON.ArcRotateCamera("cam", 0, 0, 0.1, new BABYLON.Vector3(0, 2, 0), scene);
    //var cam = new BABYLON.ArcRotateCamera("cam", 0, 0, 0.01, new BABYLON.Vector3(0, 2, 0), scene);
    cam.setPosition(new BABYLON.Vector3(5, 1, 5));
    cam.upperRadiusLimit = 0.01;
    cam.lowerRadiusLimit = 0.01;

    cam.attachControl(canvas, true);
    cam.keysLeft = [39];
    cam.keysRight = [37];
    
    //cam.ellipsoid = new BABYLON.Vector3(2, this.height, 2);
    //cam.checkCollisions = true;
    //cam.applyGravity = true;
    //cam.speed = this.speed;
    cam.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;

    scene.activeCameras.push(cam);
	


    //Ground
    var ground = BABYLON.Mesh.CreateGround("ground", 30, 30, 10, scene);
    ground.material = new BABYLON.StandardMaterial("groundMat", scene);
    //ground.material.diffuseColor = new BABYLON.Color3(0, 1, 1);
    ground.material.diffuseTexture = new BABYLON.Texture("textures/grass.jpg", scene);
    ground.material.backFaceCulling = true;
    ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.setPhysicsState(BABYLON.PhysicsEngine.PlaneImpostor, { mass: 0, 
				    friction: 0.5, restitution: 0.5 });
    ground.updatePhysicsBody();


    //Simple crate

    var box = createBox();
    box.position = new BABYLON.Vector3(3, 5, 3);
    var box2 = createBox();
    box2.position = new BABYLON.Vector3(3, 10, 3);

    //Cannonball
    var ball = createCannonball();
    ball.position = new BABYLON.Vector3(0, 5, 0);
	

    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Enable Collisions
    scene.collisionsEnabled = true;

    //Then apply collisions and gravity to the active cam
    //cam.checkCollisions = true;
    //cam.applyGravity = true;

    //Set the ellipsoid around the cam (e.g. your player's size)
    //cam.ellipsoid = new BABYLON.Vector3(1, 1, 1);

    //finally, say which mesh will be collisionable
    ground.checkCollisions = true;
    box.checkCollisions = true;

    onKeyDown = function(evt) {
	//keyStates[evt.keyCode] = true;
	//console.log(evt.keyCode);
	    if(evt.keyCode == 32) {
            var cannonball = createCannonball();
	        cannonball.position = cam.getTarget().add(new BABYLON.Vector3(0, 1, 0));
	        var dir = cam.getFrontPosition(1).subtract(cam.getTarget());
	        var mag = 20;
	        console.log(dir);
            cannonball.applyImpulse(dir.multiplyByFloats(mag, mag, mag), BABYLON.Vector3.Zero());
        }
        if(evt.keyCode == 37) {
            //cam.rotation = 0.1;
            //console.log(cam.rotation);
            //console.log(cam.cameraRotation);
            //console.log(cam.cameraDirection);
        }
    }

    return scene;
}

var scene = createScene();

engine.runRenderLoop(function() {
	scene.render();
})

window.addEventListener("resize", function() {
	engine.resize();
});


window.addEventListener("keydown", onKeyDown, false);

