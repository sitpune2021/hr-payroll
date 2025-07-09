import axios, { RawAxiosRequestHeaders, AxiosRequestConfig } from "axios";

    let apiKey = "";
    let host = "";

    /**
     * function to call the API
     * @param path 
     * @param headers 
     * @param body 
     */
    async function callApi(method, path, headers, body = {}) {

        let response = {
            status_code: 0,
            status_message: "",
            headers: {},
            body: Object()
        }

        try {

            body["APIKey"] = this.apiKey;

            let url = this.host + path;
            let result = await axios({
                url,
                headers,
                method,
                data: body
            });

            response.status_code = result.status;
            response.headers = result.headers;
            response.body = result.data;

        } catch (error) {
            console.log('error: ', error);
        }

        return response;
    }

    async function getDeviceLogs(fromDate, toDate) {
        let return_data = {
            code: 1,
            message: "SUCCESS",
            data: {
                results: [],
                current_page: 1,
                rpp: 20
            }
        };

        let body = {
            FromDate: fromDate,
            ToDate: toDate
        }

        let result = await this.callApi("GET", "/api/v2/WebAPI/GetDeviceLogs", {}, body)
        if (result.status_code == 200) {
            return_data.data.results = result.body;
        }

        return return_data;
    }

    export async function addEmployee(employeeCode, name, gender, status) {
        let return_data = {
            code: 0,
            message: "SOMETHING BROKEN",
            data: {}
        };

        let body = {
            StaffCode: employeeCode,
            StaffName: name,
            Gender: gender,
            Status: status
        }

        let result = await this.callApi("POST", "/api/v2/WebAPI/AddEmployee", {}, body)
        if (result.status_code == 200) {
            return_data.code = 1;
            return_data.message = "SUCCESS";
            return_data.data = result.body;
        } else {
            return_data.message = result.status_message;
        }

        return return_data;
    }

    async function updateEmployee(employeeCode, name, cardNumber, serialNumber, verifyMode) {
        let return_data = {
            code: 0,
            message: "SOMETHING BROKEN",
            data: {}
        };

        let body = {
            StaffCode: employeeCode,
            StaffName: name,
            CardNumber: cardNumber,
            SerialNumbers: serialNumber,
            VerifyMode: verifyMode
        }

        let result = await this.callApi("POST", "/api/v2/WebAPI/UploadUser", {}, body)
        if (result.status_code == 200) {
            return_data.code = 1;
            return_data.message = "SUCCESS";
            return_data.data = result.body;
        } else {
            return_data.message = result.status_message;
        }

        return return_data;
    }

    export async function deleteEmployee(employeeCode, serialNumber) {
        let return_data = {
            code: 0,
            message: "SOMETHING BROKEN",
            data: {}
        };

        let body = {
            StaffCode: employeeCode,
            SerialNumbers: serialNumber
        }

        let result = await this.callApi("POST", "/api/v2/WebAPI/DeleteUser", {}, body)
        if (result.status_code == 200) {
            return_data.code = 1;
            return_data.message = "SUCCESS";
            return_data.data = result.body;
        } else {
            return_data.message = result.status_message;
        }

        return return_data;
    }

    async function addEmployeeExpiry(employeeCode, serialNumber, expirationDate) {
        let return_data = {
            code: 0,
            message: "SOMETHING BROKEN",
            data: {}
        };

        let body = {
            StaffCode: employeeCode,
            SerialNumbers: serialNumber,
            ExpirationDate: expirationDate
        }

        let result = await this.callApi("POST", "/api/v2/WebAPI/SetUserExpiration", {}, body)
        if (result.status_code == 200) {
            return_data.code = 1;
            return_data.message = "SUCCESS";
            return_data.data = result.body;
        } else {
            return_data.message = result.status_message;
        }

        return return_data;
    }

    module.exports = { callApi, addEmployee, addEmployeeExpiry, getDeviceLogs, updateEmployee, deleteEmployee }