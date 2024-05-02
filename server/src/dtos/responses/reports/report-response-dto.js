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
     * @param {mixed} data
     * @returns {void}
     */
    constructor(success, data) {
        this.success = success;
        this.data = data;
    }
};