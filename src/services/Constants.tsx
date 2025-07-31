import AsyncStorage from "@react-native-async-storage/async-storage";
interface AppSettings {
    getUrl: () => Promise<string>;
    BASE_URL: () => Promise<string>;
}
const getUrlFromStorage = async (): Promise<string> => {
    try {
        const val = await AsyncStorage.getItem('selectenv');
        let currentURL = 'https://api.elitecap.net';

        if (val === 'deve') {
            currentURL = 'https://devapi.elitecap.net';
            
        } else if (val === 'val') {
            currentURL = 'https://valapi.elitecap.net';

        }
         await AsyncStorage.setItem('currentURL',currentURL);
        console.log('currentURL',currentURL)
        return currentURL;
    } catch (error) {
        console.error('Error retrieving environment setting:', error);
        return 'https://api.elitecap.net'; 
    }
};

const AppSettings: AppSettings = {
    getUrl: async () => {
        const url = await getUrlFromStorage();
        console.log(url,"urltest");
        return url;
    },
    BASE_URL: async () => {
        return await AppSettings.getUrl();
    },

};

export default AppSettings;

