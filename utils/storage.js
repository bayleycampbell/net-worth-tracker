import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'netWorthData';

const defaultData = () => ({
  assets: [],
  liabilities: [],
  lastUpdated: new Date().toISOString(),
});

export async function loadNetWorthData() {
  const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (!jsonValue) {
    return defaultData();
  }

  const data = JSON.parse(jsonValue);
  return {
    assets: Array.isArray(data.assets) ? data.assets : [],
    liabilities: Array.isArray(data.liabilities) ? data.liabilities : [],
    lastUpdated: data.lastUpdated || new Date().toISOString(),
  };
}

export async function saveNetWorthData(data) {
  const payload = {
    assets: Array.isArray(data.assets) ? data.assets : [],
    liabilities: Array.isArray(data.liabilities) ? data.liabilities : [],
    lastUpdated: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export async function saveAssets(assets) {
  const data = await loadNetWorthData();
  data.assets = assets;
  await saveNetWorthData(data);
}

export async function saveLiabilities(liabilities) {
  const data = await loadNetWorthData();
  data.liabilities = liabilities;
  await saveNetWorthData(data);
}
