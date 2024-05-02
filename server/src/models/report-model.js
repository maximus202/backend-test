import { Database } from '../services/database.js';

/**
 * ReportModel
 * 
 * This is the report model.
 * 
 * @class ReportModel
 */
export class ReportModel {
    /**
     * This constructs the model.
     * 
     * @param {Database} database 
     * @returns {void}
     */
    constructor(database = new Database()) {
        this.database = database;
    };

    /**
     * This gets the tasks by worker.
     * 
     * @param {int} workerId 
     * @param {boolean} completedTasks 
     * @returns {array}
     */
    async getTasksByWorker(workerId = null, completedTasks = null) {
        let query = `SELECT t.*,
        l.name AS location_name,
        w.id AS worker_id,
        w.username AS worker_username,
        lt.time_seconds AS logged_seconds,
        w.hourly_wage
        FROM tasks AS t
        LEFT JOIN logged_time AS lt ON t.id = lt.task_id
        LEFT JOIN workers AS w ON lt.worker_id = w.id
        LEFT JOIN locations AS l ON t.location_id = l.id`;

        const bindParams = [];
        if (workerId) {
            query += ` WHERE w.id = ?`;
            bindParams.push(workerId);
        }
        if (completedTasks !== null) {
            query += ` AND t.completed = ?`;
            bindParams.push(completedTasks);
        }

        return await this.database.query(query, bindParams);
    }

    /**
     * This gets the tasks by location.
     * 
     * @param {int} locationId 
     * @param {boolean} completedTasks 
     * @returns {array}
     */
    async getTasksByLocation(locationId = null, completedTasks = null) {
        let query = `SELECT t.*,
        l.name AS location_name,
        w.id AS worker_id,
        w.username AS worker_username,
        lt.time_seconds AS logged_seconds,
        w.hourly_wage
        FROM tasks AS t
        LEFT JOIN logged_time AS lt ON t.id = lt.task_id
        LEFT JOIN workers AS w ON lt.worker_id = w.id
        LEFT JOIN locations AS l ON t.location_id = l.id
        WHERE lt.id IS NOT NULL`;

        const bindParams = [];
        if (locationId) {
            query += ` AND l.id = ?`;
            bindParams.push(locationId);
        }
        if (completedTasks !== null) {
            query += ` AND t.completed = ?`;
            bindParams.push(completedTasks);
        }

        return await this.database.query(query, bindParams);
    }
}