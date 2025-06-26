import * as THREE from "/Potree_Sncf_Projet/libs/three.js/build/three.module.js";
import {EventDispatcher} from "/Potree_Sncf_Projet/src/EventDispatcher.js";

export class OrientedImageControls extends EventDispatcher{
	
	constructor(viewer){
		super();
		
		this.viewer = viewer;
		this.renderer = viewer.renderer;

		this.active = false; // Contrôles désactivés par défaut

		this.originalCam = viewer.scene.getActiveCamera();
		this.shearCam = viewer.scene.getActiveCamera().clone();
		this.shearCam.rotation.set(this.originalCam.rotation.toArray());
		this.shearCam.updateProjectionMatrix();
		// Forcer la mise à jour de la projectionMatrix
		this.shearCam.updateProjectionMatrix = () => {
			return this.shearCam.projectionMatrix;
		};

		this.image = null;

		this.fadeFactor = 20;
		this.fovDelta = 0;

		this.fovMin = 0.1;
		this.fovMax = 120;

		this.shear = [0, 0];

		// Crée le conteneur overlay et les éléments DOM de contrôle
		this._initDOMElements();

		this.scene = null;
		this.sceneControls = new THREE.Scene();

		let scroll = (e) => {
			this.fovDelta += -e.delta * 1.0;
			// Empêcher le zoom au-delà d'un certain point
			if (this.viewer.getFOV() < 5) {
				this.fovDelta = 0; // Limite du zoom
			}
		};
		this.addEventListener('mousewheel', scroll);
		//this.addEventListener("mousemove", onMove);
	}

	/**
	 * Crée un conteneur overlay fixe pour les contrôles et y crée les boutons.
	 */
	_initDOMElements(){
		// Crée un conteneur overlay qui couvre l'écran entier.
		this.controlsContainer = $(`<div id="orientedControlsContainer" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10000;"></div>`);
		this.elUp = $(`<input type="button" class="elUp" value="🡅" />`);
	  	this.elRight = $(`<input type="button" class="elRight" value="🡆" />`);
	  	this.elDown = $(`<input type="button" class="elDown" value="🡇" />`);
	  	this.elLeft = $(`<input type="button" class="elLeft" value="🡄" />`);
		this.elExit = $(`<input type="button" class="oriented-exit-btn" value="Revenir à la vue 3D" style="pointer-events: auto; position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);" />`);		// Bouton de sortie qui appelle release()
		this.elExit.click(() => {
			this.release();
		});

		// Bouton flèche haut
		this.elUp.click(() => {
			const fovY = this.viewer.getFOV();
			const top = Math.tan(THREE.Math.degToRad(fovY / 2));
			this.shear[1] += 0.1 * top;
		});

		// Bouton flèche droite
		this.elRight.click(() => {
			const fovY = this.viewer.getFOV();
			const top = Math.tan(THREE.Math.degToRad(fovY / 2));
			this.shear[0] += 0.1 * top;
		});

		// Bouton flèche bas
		this.elDown.click(() => {
			const fovY = this.viewer.getFOV();
			const top = Math.tan(THREE.Math.degToRad(fovY / 2));
			this.shear[1] -= 0.1 * top;
		});

		// Bouton flèche gauche
		this.elLeft.click(() => {
			const fovY = this.viewer.getFOV();
			const top = Math.tan(THREE.Math.degToRad(fovY / 2));
			this.shear[0] -= 0.1 * top;
		});

		// Ajoute les boutons dans le conteneur
		this.controlsContainer.append(this.elUp);
		this.controlsContainer.append(this.elRight);
		this.controlsContainer.append(this.elDown);
		this.controlsContainer.append(this.elLeft);
		this.controlsContainer.append(this.elExit);
	}

	// Vérifie s'il y a une image capturée
	hasSomethingCaptured(){
		return this.image !== null;
	}

	capture(image) {
	    if (this.hasSomethingCaptured()) {
	        return;
	    }
	
	    // Masquer toutes les images sauf celle qui est capturée
	    if (window.orientedImages && window.orientedImages.images) {
	        window.orientedImages.images.forEach(function(img) {
	            if (img !== image) {
	                img.mesh.visible = false;
	                img.line.visible = false;
	            }
	        });
	    }
	
	    this.image = image;
	    this.active = true;
	
	    this.originalFOV = this.viewer.getFOV();
	    this.originalControls = this.viewer.getControls();
	
	    this.viewer.setControls(this);
	    this.viewer.scene.overrideCamera = this.shearCam;
	
	    this.shear = [0, 0];
	
	    // Masquer le bouton "Désactiver images orientées"
	    $('#toggleOrientedImages').hide();
	
	    // Ajouter le conteneur des contrôles dans le document
	    $(document.body).append(this.controlsContainer);
	}

	release() {
	    if (document.fullscreenElement) {
	        document.exitFullscreen();
	    }
	
	    // Réafficher toutes les images
	    if (window.orientedImages && window.orientedImages.images) {
	        window.orientedImages.images.forEach(function(img) {
	            img.mesh.visible = true;
	            img.line.visible = true;
	        });
	    }
	
	    this.image = null;
	    this.active = false; // Désactivation pour stopper update()
	
	    this.viewer.scene.overrideCamera = null;
	
	    // Réafficher le bouton "Désactiver images orientées"
	    $('#toggleOrientedImages').show();
	
	    // Retirer le conteneur de contrôle du DOM
	    this.controlsContainer.remove();
	
	    // Rétablir le champ de vision et les contrôles originaux du viewer
	    this.viewer.setFOV(this.originalFOV);
	    this.viewer.setControls(this.originalControls);
	
	    // Recréer le conteneur et les boutons pour une future utilisation
	    this._initDOMElements();
	}
	
	setScene (scene) {
		this.scene = scene;
	}

	update (delta) {
		// Ne met rien à jour si le contrôle n'est pas actif
		if(!this.active) return;

		const progression = 1;
		const attenuation = 0;

		const oldFov = this.viewer.getFOV();
		let fovProgression = progression * this.fovDelta;
		let newFov = oldFov * ((1 + fovProgression / 10));

		newFov = Math.max(this.fovMin, newFov);
		newFov = Math.min(this.fovMax, newFov);

		let diff = newFov / oldFov;

		const mouse = this.viewer.inputHandler.mouse;
		const canvasSize = this.viewer.renderer.getSize(new THREE.Vector2());
		const uv = [
			(mouse.x / canvasSize.x),
			((canvasSize.y - mouse.y) / canvasSize.y)
		];

		const fovY = newFov;
		const aspect = canvasSize.x / canvasSize.y;
		const top = Math.tan(THREE.Math.degToRad(fovY / 2));
		const height = 2 * top;
		const width = aspect * height;

		const shearRangeX = [
			this.shear[0] - 0.5 * width,
			this.shear[0] + 0.5 * width,
		];

		const shearRangeY = [
			this.shear[1] - 0.5 * height,
			this.shear[1] + 0.5 * height,
		];

		const shx = (1 - uv[0]) * shearRangeX[0] + uv[0] * shearRangeX[1];
		const shy = (1 - uv[1]) * shearRangeY[0] + uv[1] * shearRangeY[1];

		const shu = (1 - diff);

		const newShear = [
			(1 - shu) * this.shear[0] + shu * shx,
			(1 - shu) * this.shear[1] + shu * shy,
		];
		
		this.shear = newShear;
		this.viewer.setFOV(newFov);
		
		const {originalCam, shearCam} = this;

		originalCam.fov = newFov;
		originalCam.updateMatrixWorld();
		originalCam.updateProjectionMatrix();
		shearCam.copy(originalCam);
		shearCam.rotation.set(...originalCam.rotation.toArray());

		shearCam.updateMatrixWorld();
		shearCam.projectionMatrix.copy(originalCam.projectionMatrix);

		const [sx, sy] = this.shear;
		const mShear = new THREE.Matrix4().set(
			1, 0, sx, 0,
			0, 1, sy, 0,
			0, 0, 1, 0,
			0, 0, 0, 1
		);

		const proj = shearCam.projectionMatrix;
		proj.multiply(mShear);
		shearCam.projectionMatrixInverse.copy(proj).invert();

		// Réinitialise le fovDelta (puisque attenuation est ici à 0)
		this.fovDelta *= attenuation;
	}
}
