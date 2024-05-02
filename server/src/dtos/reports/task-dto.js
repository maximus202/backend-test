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
        this.worker_id = task.worker_id;
        this.worker_username = task.worker_username;
        this.logged_seconds = task.logged_seconds;
        this.hourly_wage = task.hourly_wage;
        this.labor_cost = Number(task.labor_cost.toFixed(2))
    }
}