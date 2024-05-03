import { FormatCurrency } from "../../../utils/format-currency.js";

/**
 * TaskDTO
 * 
 * This creates a task DTO.
 * 
 * @class TaskDTO
 */
export class TaskDTO {
    /**
     * This constructs the task DTO.
     * 
     * @param {object} task 
     * @returns {void}
     */
    constructor(task) {
        this.task_id = task.id;
        this.description = task.description;
        this.completed = task.completed;
        this.location_id = task.location_id;
        this.location_name = task.location_name;
        this.logged_seconds = task.logged_seconds;
        this.labor_cost = FormatCurrency(task.labor_cost);
    }
};