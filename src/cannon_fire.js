var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);


var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.CannonJSPlugin());

    // Mesh Functions
    var createBox = function(pos) {
	var box = BABYLON.Mesh.CreateBox("crate", 2, scene);
	box.material = new BABYLON.StandardMaterial("Mat", scene);

	box.material.diffuseTexture = new BABYLON.Texture("textures/crate.png", scene);
	//box.material.diffuseTexture.hasAlpha = true;
	box.position = pos;
	box.setPhysicsState(BABYLON.PhysicsEngine.BoxImpostor, { mass: 1, 
	    friction: 0.3, restitution: 0.5 });

	return box;
    }

    var createCannonball = function(pos) {
	var ball = BABYLON.Mesh.CreateSphere("ball", 10, 1, scene);
	ball.material = new BABYLON.StandardMaterial("Mat", scene);
	ball.material.diffuseColor = new BABYLON.Color3(0, 0, 0);
	ball.position = pos;
	ball.physicsImpostor = new BABYLON.PhysicsImpostor(ball, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, friction: 0, restitution: 0 }, scene );

	return ball;
    }


    // Lights
    var light0 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(5, 5, 5), scene);
    var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(-5, -5, -5), scene);
    var light2 = new BABYLON.DirectionalLight("directionallight", new BABYLON.Vector3(-1, -1, 1), scene);


    // Camera
    var camHeight = 20;
    var cam = new BABYLON.ArcRotateCamera("cam", 0, 0, 0.1, new BABYLON.Vector3(0, camHeight, 0), scene);
    cam.setPosition(new BABYLON.Vector3(-1, camHeight, 1));
    cam.upperRadiusLimit = 0.1;
    cam.lowerRadiusLimit = 0.1;
    cam.speed = 50;
    cam.inertia = 0.7;
    cam.angularSensibilityX = 200;
    cam.attachControl(window, true);
    cam.keysLeft = [39];
    cam.keysRight = [37];

    scene.activeCameras.push(cam);



    //Ground
    var maxTerrainHeight = 19;

    var ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "textures/heightMaps/mountain2HeightMap.png", 100, 100, 100, 0, maxTerrainHeight, scene, false, function() {
	ground.physicsImpostor = new BABYLON.PhysicsImpostor( ground, BABYLON.PhysicsImpostor.HeightmapImpostor, { mass: 0, friction: 0, restitution: 0 }, scene);

	//window.addEventListener("keydown", this.onKeyDown, false);

    });
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 6;
    groundMaterial.diffuseTexture.vScale = 6;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    groundMaterial.backFaceCulling = true;
    ground.material = groundMaterial;



    // Keyboard Input
    onKeyDown = function(evt) {
	//keyStates[evt.keyCode] = true;
	//console.log(evt.keyCode);
	var keySpace = 32;
	// Shoot
	if(evt.keyCode == keySpace) {
	    var cannonball = createCannonball(cam.getTarget().add(new BABYLON.Vector3(0, 3, 0)));
	    var dir = cam.getFrontPosition(1).subtract(cam.getTarget()).normalize();
	    var mag = 20;
	    cannonball.physicsImpostor.applyImpulse(dir.multiplyByFloats(mag, mag, mag), BABYLON.Vector3.Zero());
	}
    }

    // Create crates

    var box = createBox(new BABYLON.Vector3(10, 5, -10));
    var box2 = createBox(new BABYLON.Vector3(10, 10, -10));

    // Skybox
    var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;

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

