import { FormatCurrency } from "../../../../utils/format-currency.js";
import { TaskDTO } from "../../../dtos/reports/task-dto.js";

/**
 * TaskReport
 * 
 * This is the task report helper.
 * 
 * @class TaskReport
 */
export const TaskReport = {
    /**
     * This creates the task report.
     * 
     * @param {array} rows 
     * @returns {object}
     */
    create(rows) {
        /**
		 * Put together tasks object.
		 */
		const tasks = {};
		let totalLaborCost = 0;
		rows.forEach((row) => {
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

        return {
            total_labor_cost: FormatCurrency(totalLaborCost),
            tasks
        };
    },

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
};