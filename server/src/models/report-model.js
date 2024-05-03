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
     * This gets the task costs.
     * 
     * @param {int} workerId 
     * @param {int} locationId 
     * @param {bool} completedTasks 
     */
    async getTaskCosts(workerId = null, locationId = null, completedTasks = null) {
        let sql = `SELECT t.*,
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

        /**
         * If workerId is set, add it to the query.
         */
        if (workerId) {
            sql += ` AND w.id = ?`;
            bindParams.push(workerId);
        }

        /**
         * If locationId is set, add it to the query.
         */
        if (locationId) {
            sql += ` AND l.id = ?`;
            bindParams.push(locationId);
        }

        /**
         * If completedTasks is set, add it to the query.
         */
        if (completedTasks !== null) {
            sql += ` AND t.completed = ?`;
            bindParams.push(completedTasks);
        }

        return await this.database.query(sql, bindParams);
    };
};