import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getCanvas, getGroup, getScene } from '../../features/scene/sceneSlice';
import Button from "../Button/Button";
import * as THREE from "three";

export default function CommentsListPanel() {

    const scene = useSelector(getScene);
    const group = useSelector(getGroup);
    const canvas = useSelector(getCanvas);
    const camera = scene.children && scene.children.find((children) => children.type === "PerspectiveCamera");
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    // Dispatch the resize event to recalculate the width of the canvas when the bar is open and close (return)
    useEffect(() => {
        window.dispatchEvent(new Event('resize'));

        return () => {
            canvas.removeEventListener('dblclick', onPointerClick);
            window.dispatchEvent(new Event('resize'));
        }
    });

    const handleClick = () => {

        canvas.addEventListener('dblclick', onPointerClick);

        // const geometry = new THREE.BoxGeometry(10, 10, 10);
        // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        // const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);
    }

    /**
     * Double Click event, the function creates a point when the user clicks on the mesh
     * @param {Event} event 
     */
    const onPointerClick = (event) => {

        pointer.x = (event.clientX / canvas.offsetWidth) * 2 - 1;
        pointer.y = - (event.clientY / canvas.offsetHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);

        // See if the ray from the camera into the world hits one of our meshes
        const intersects = raycaster.intersectObjects(group.children, true);

        // Creates a point
        const geometry = new THREE.SphereGeometry( 0.5, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const sphere = new THREE.Mesh( geometry, material );

        console.log(intersects);
        if (intersects.length > 0) {
            for ( let i = 0; i < intersects.length; i ++ ) {

                //intersects[ i ].object.material.color.set( 0xff0000 );
                sphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
                scene.add( sphere );

            }
        }
    }

    return (
        <div className="commentsListPanel">
            <h3>Comments</h3>
            <div className="sidebar__buttons">
                <Button typeClass="btn--size" text="ADD COMMENT" onClick={handleClick} />
            </div>
        </div>
    )
}
