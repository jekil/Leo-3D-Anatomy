import { ObjectsModel } from '../models/ObjectsModel';

export class ObjectsController {

    /**
     * Gets the object by uuid
     * @param {String} objectId The uuid of the object
     * @returns The object by uuid
     */
    static getObjectById(id) {
        return ObjectsModel.query().findById(id);
    }

    /**
     * Gets the list of objects of a project
     * @param {String} projectId Project ID
     * @returns List of objects by project id only json field
     */
    static getObjectsByProjectId(projectId) {
        return ObjectsModel.query().select('objects.object_path').where('objects.project_id', projectId);
    }

    /**
     * Saves the object on the db
     * @param {Object} object 
     * @returns The object inserted
     */
    static createObject(object) {
        return ObjectsModel.query().insert({
            id: object.object_id,
            project_id: object.project_id,
            object: object.object
        })
    }

    /**
     * Saves the object in the db
     * @param {Object} object Id
     * @param {String} projectId 
     * @param {String} filepath 
     * @returns 
     */
    static saveObject(objectId, projectId, filepath) {
        return ObjectsModel.query().insert({
            id: objectId,
            project_id: projectId,
            object: {"model": "model.json"},
            object_path: filepath
        })
    }

    static deleteObject(id) {
        return ObjectsModel.query().deleteById(id);
    }
}