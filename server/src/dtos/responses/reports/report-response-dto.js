/**
 * ReportResponseDTO
 * 
 * This is the report response DTO.
 * 
 * @class ReportResponseDTO
 */
export class ReportResponseDTO {
    /**
     * This constructs the response DTO.
     * 
     * @param {bool} success
     * @param {float} totalLaborCost
     * @param {array} data
     * @returns {void}
     */
    constructor(success, totalLaborCost, data) {
        this.success = success;
        this.totalLaborCost = totalLaborCost;
        this.data = {
            tasks: data
        };
    }
}