import { ReportModel } from '../models/report-model.js';
import { ReportResponseDTO } from '../dtos/responses/reports/report-response-dto.js';
import { TaskReport } from '../helpers/reports/tasks/task-report.js';

/**
 * ReportController
 * 
 * This is the report controller.
 * 
 * @class ReportController
 */
export class ReportController {
    /**
     * This sets the model.
     * 
     * @returns {void}
     */
    constructor() {
        this.model = new ReportModel();
    }
    
    /**
     * This gets the tasks by worker report.
     * 
     * @param {int} workerId
     * @param {boolean} completedTasks
     * @returns {object}
     */
    async getTasksByWorker(workerId = null, completedTasks = null) {
        /**
		 * Query database.
		 */
		const rows = await this.model.getTasksByWorker(workerId, completedTasks);
        const report = TaskReport.create(rows);
        return new ReportResponseDTO(true, report);
    }

    /**
     * This gets the tasks by location report.
     * 
     * @param {int} locationId 
     * @param {boolean} completedTasks 
     */
    async getTasksByLocation(locationId = null, completedTasks = null) {
		const rows = await this.model.getTasksByLocation(locationId, completedTasks);
        const report = TaskReport.create(rows);
        return new ReportResponseDTO(true, report);
    };
}