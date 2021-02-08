import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Session {
    static async getUserInfo() {
        try {
            let userData = await AsyncStorage.getItem("userData");
            let data = JSON.parse(userData);
            
            return data;
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    static async removeUserInfo() {
        try {
            await AsyncStorage.removeItem("userData");
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    static async saveCustomValue(value, data) {
        try {
            await AsyncStorage.setItem(value, JSON.stringify(data));
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    static async getCustomValue(value) {
        try {
            let customData = await AsyncStorage.getItem(value);
            let data = JSON.parse(customData);
            
            return data;
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    static async removeCustomValue(value) {
        try {
            await AsyncStorage.removeItem(value);
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }
}
