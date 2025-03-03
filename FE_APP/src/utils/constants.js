import Constants from "expo-constants";

const NAVER_CLIENT_ID = Constants.expoConfig?.extra?.naverClientId || "";
const NAVER_CLIENT_SECRET = Constants.expoConfig?.extra?.naverClientSecret || "";

export { NAVER_CLIENT_ID, NAVER_CLIENT_SECRET };
