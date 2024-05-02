import { ReportModel } from '../models/report-model.js';
import { TaskDTO } from '../dtos/reports/task-dto.js';
import { FormatCurrency } from '../../utils/format-currency.js';
import { ReportResponseDTO } from '../dtos/responses/reports/report-response-dto.js';

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

		/**
		 * Put together tasks object.
		 */
		const tasks = {};
		let totalLaborCost = 0;
		rows.forEach(row => {
			/**
			 * Calculate labor cost.
			 */
            row.labor_cost = this.calculateLaborCost(row);
			totalLaborCost += row.labor_cost;

			/**
			 * If task is not in the object, add it.
			 */
			if (!tasks[row.id]) {
				tasks[row.id] = new TaskDTO(row);
				return;
			}

			/**
			 * Add labor cost and seconds to task totals.
			 * Labor cost needs to use 2 decimal places.
			 */
			tasks[row.id].labor_cost += FormatCurrency(row.labor_cost);
			tasks[row.id].logged_seconds += row.logged_seconds;
		});

        totalLaborCost = FormatCurrency(totalLaborCost);
        return new ReportResponseDTO(true, totalLaborCost, tasks);
    }

    /**
     * This gets the tasks by location report.
     * 
     * @param {int} locationId 
     * @param {boolean} completedTasks 
     */
    async getTasksByLocation(locationId = null, completedTasks = null) {
        /**
		 * Query database.
		 */
		const rows = await this.model.getTasksByLocation(locationId, completedTasks);

		/**
		 * Put together tasks object.
		 */
		const tasks = {};
		let totalLaborCost = 0;
		rows.forEach(row => {
			/**
			 * Calculate labor cost.
			 */
            row.labor_cost = this.calculateLaborCost(row);
			totalLaborCost += row.labor_cost;

			/**
			 * If task is not in the object, add it.
			 */
			if (!tasks[row.id]) {
				tasks[row.id] = new TaskDTO(row);
				return;
			}

			/**
			 * Add labor cost and seconds to task totals.
			 * Labor cost needs to use 2 decimal places.
			 */
			tasks[row.id].labor_cost += FormatCurrency(row.labor_cost);
			tasks[row.id].logged_seconds += row.logged_seconds;
		});

        totalLaborCost = FormatCurrency(totalLaborCost);
        return new ReportResponseDTO(true, totalLaborCost, tasks);
    };

    /**
     * This calculates the labor cost.
     * 
     * @param {object} task 
     * @returns {int}
     */
    calculateLaborCost(task) {
        if (!task.hourly_wage || !task.logged_seconds)
        {
            task.labor_cost = 0;
            return;
        }

        const SECONDS_IN_HOUR = 3600;
        return (task.logged_seconds / SECONDS_IN_HOUR) * task.hourly_wage;
    }
}