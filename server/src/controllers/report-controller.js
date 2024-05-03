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
     * @param {int} locationId
     * @returns {object}
     */
    async getTaskCosts(workerId = null, completedTasks = null, locationId = null) {
        try {
            const rows = await this.model.getTaskCosts(workerId, locationId, completedTasks);
            const report = TaskReport.create(rows);
            return new ReportResponseDTO(true, report);
        } catch (error) {
            return new ReportResponseDTO(false, null);
        }
    }
};