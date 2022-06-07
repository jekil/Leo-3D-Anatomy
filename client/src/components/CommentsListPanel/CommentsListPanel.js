import PropTypes from "prop-types";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as THREE from "three";
import { UserContext } from "../../context/UserContext";
import { getIsTextOpen } from "../../features/comments/commentsSlice";
import { getCommentCounter, setCommentCounter } from "../../features/counters/countersSlice";
import { getHeaderHeight, getSidebarWidth } from "../../features/dimensions/dimensionsSlice";
import {
  getCamera,
  getCanvas,
  getGroup,
  getScene,
  getSceneModified,
  getSelectedMesh,
  setSceneModified,
  setSelectedMesh,
} from "../../features/scene/sceneSlice";
import { getCommentsByProjectIdAndPointId, saveComment, saveObject } from "../../utils/api";
import { createLabel } from "../../utils/functions/objectLabel";
import Button from "../Button/Button";
import Comments from "../Comments/Comments";
import Panel from "../Panel/Panel";

export default function CommentsListPanel({ projectId }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const [openText, setOpenText] = useState(false);
  const [comments, setComments] = useState([]);

  const { user } = useContext(UserContext);

  const scene = useSelector(getScene);
  const group = useSelector(getGroup);
  const canvas = useSelector(getCanvas);
  const isModified = useSelector(getSceneModified);
  const isTextOpen = useSelector(getIsTextOpen);
  const sidebarWidth = useSelector(getSidebarWidth);
  const headerHeight = useSelector(getHeaderHeight);
  const commentCounter = useSelector(getCommentCounter);
  const selectedMesh = useSelector(getSelectedMesh);
  const camera = useSelector(getCamera);

  const dispatch = useDispatch();
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const tControls = scene.children && scene.children.find((obj) => obj.name === "TransformControls");

  // Dispatch the resize event to recalculate the width of the canvas when the bar is open and close (return)
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));

    return () => {
      canvas.removeEventListener("dblclick", onPointerClick);
      window.dispatchEvent(new Event("resize"));
    };
  });

  useEffect(async () => {
    if (selectedMesh) {
      setOpenText(true);

      const response = await getCommentsByProjectIdAndPointId(projectId, selectedMesh);
      setComments(response);
    }
  }, [isTextOpen]);

  const addPoint = () => {
    canvas.addEventListener("dblclick", onPointerClick);
  };

  /**
   * Double Click event, the function creates a point when the user clicks on the mesh
   * @param {Event} event
   */
  const onPointerClick = async (event) => {
    console.log("pointerClick");

    pointer.x = ((event.clientX - sidebarWidth) / canvas.offsetWidth) * 2 - 1;
    pointer.y = -((event.clientY - headerHeight) / canvas.offsetHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    // Sees if the ray from the camera into the world hits one of our meshes
    const intersects = raycaster.intersectObjects(group.children, true);

    // Creates a point
    const geometry = new THREE.SphereGeometry(0.5, 32, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const sphere = new THREE.Mesh(geometry, material);

    if (intersects.length > 0) {
      sphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
      sphere.name = "Comment" + (commentCounter + 1);
      scene.add(sphere);

      createLabel(sphere);

      console.log(sphere);

      tControls.detach();

      // updates the matrix position before convert to JSON
      sphere.updateMatrixWorld(true);

      const object = JSON.stringify(sphere.toJSON());
      const file = new Blob([object], { type: "application/json" });

      await saveObject(sphere.uuid, projectId, file, `${sphere.uuid}.json`);

      setOpenText(true);
      setComments([]);

      // dispatch(setIsTextOpen(true));
      dispatch(setCommentCounter(commentCounter + 1));
      dispatch(setSelectedMesh(sphere.uuid));
      dispatch(setSceneModified(!isModified));
    }
  };

  const onSave = async (data, e) => {
    const comment = {
      projectId: projectId,
      userId: user.id,
      text: data.text,
      pointId: selectedMesh,
    };

    const response = await saveComment(comment);

    setComments(response);
    e.target.reset();
  };

  return (
    <div className="comments  bg-baseLight dark:bg-base text-white">
      <div className="properties">Comments</div>
      <div className="sidebar__buttons">
        <Button typeClass="btn--size" text="ADD POINT" onClick={addPoint} />
        {/* <AddPoint /> */}
      </div>
      <div className="comments__panel">
        <div className="properties">Points tree</div>
        <Panel type="points" />
      </div>
      {openText && (
        <div>
          <form className="comments__text flex flex-col" onSubmit={handleSubmit(onSave)}>
            <div>
              <label htmlFor="comment">Add Comment</label>
              <textarea name="comment" id="comment" cols="30" rows="5" {...register("text")} />
            </div>
            <div className="flex justify-between comments__btn">
              <Button typeClass="btn--size" text="SAVE" />
              <input className="btn btn--size" type="reset" value="RESET" />
            </div>
          </form>
          <Comments comments={comments} />
        </div>
      )}
    </div>
  );
}

CommentsListPanel.propTypes = {
  projectId: PropTypes.string.isRequired,
};
