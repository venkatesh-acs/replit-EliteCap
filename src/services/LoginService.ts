import AppSettings from "./Constants";
import axios from "axios";

export const LoginService = {
    async getData(apiname: string, data: any) {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await fetch(`${baseUrl}${apiname}`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            return json;
        } catch (error) {
            console.error(`Error fetching data from ${apiname}`, error);
            throw error;
        }
    },
    async getDatas(apiname: string, data: any): Promise<any> {
        try {
            const baseUrl = await AppSettings.BASE_URL();
            const response = await axios.post(`${baseUrl}${apiname}`, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${apiname}`, error);
            throw error;
        }
    },

    async uploadimage(apiname: string, formdata: FormData): Promise<any> {
        try {
            console.log("testee");
            const baseUrl = await AppSettings.BASE_URL();
            console.log(baseUrl, "baseurl");
            const response = await axios.post(`${baseUrl}${apiname}`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response:', response.status, response.data);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error:', error.message);
                console.error('Request details:', error.config);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                }
            } else {
                console.error('Unexpected error:', error);
            }
            throw error;
        }

    },
    async getauthcode(apiname: string, data: any): Promise<any> {
        try {
            let body = JSON.stringify(data);

            const response = await axios.post(`${'https://jwtauth.jwtechinc.com/'}${apiname}`, body, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching data from ${apiname}`, error);
            throw error;
        }
    },
};
