const conf = {
    appwriteUrl: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    appwriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    appwriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
    appwriteUsersCollectionId: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
    appwritewalletCollectionId: String(import.meta.env.VITE_APPWRITE_WALLETS_COLLECTION_ID),
    appwritecurrencyCollectionId: String(import.meta.env.VITE_APPWRITE_CURRENCIES_COLLECTION_ID),
    appwritetransactionCollectionId: String(import.meta.env.VITE_APPWRITE_TRANSACTIONS_COLLECTION_ID),
};

export default conf;