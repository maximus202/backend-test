import { ReportModel } from '../models/report-model.js';

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
			if (!row.hourly_wage || !row.logged_seconds)
			{
				row.labor_cost = 0;
				return;
			}

			row.labor_cost = (row.logged_seconds / 3600) * row.hourly_wage;
			totalLaborCost += row.labor_cost;

			/**
			 * If task is not in the object, add it.
			 */
			if (!tasks[row.id]) {
				tasks[row.id] = {
					task_id: row.id,
					description: row.description,
					completed: row.completed,
					location_id: row.location_id,
					location_name: row.location_name,
					worker_id: row.worker_id,
					worker_username: row.worker_username,
					hourly_wage: row.hourly_wage,
					logged_seconds: row.logged_seconds,
					labor_cost: Number(row.labor_cost.toFixed(2))
				};
				return;
			}

			/**
			 * Add labor cost and seconds to task totals.
			 * Labor cost needs to use 2 decimal places.
			 */
			tasks[row.id].labor_cost += Number(row.labor_cost.toFixed(2));
			tasks[row.id].logged_seconds += row.logged_seconds;
		});

        return {
			success: true,
			total_labor_cost: Number(totalLaborCost.toFixed(2)),
			data: {
				task_ids: tasks
			}
		};
    }
}