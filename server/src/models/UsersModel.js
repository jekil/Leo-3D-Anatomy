import { Model } from 'objection';
import { ProjectsModel } from './ProjectsModel';

export class UsersModel extends Model {

    $beforeInsert() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    $beforeUpdate() {
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    static get tableName() {
        return 'users';
    }

    static get relationMappings() {
        return {
            projects: {
                relation: Model.HasManyRelation,
                modelClass: ProjectsModel,
                join: {
                    from: 'users.id',
                    to: 'projects.user_id'
                }
            },
        }
    }
}