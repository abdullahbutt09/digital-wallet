import conf from "../config/ConfigID";
import { Client, Account, ID, Databases } from "appwrite";

export class AuthService {
    client = new Client();
    account;
    databases;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl) // Your Appwrite Endpoint
            .setProject(conf.appwriteProjectId); // Your Appwrite Project ID

        this.account = new Account(this.client);
        this.databases = new Databases(this.client);
    }

    resetClient() {
    this.client = new Client()
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
    this.databases = new Databases(this.client);

    console.log("Appwrite client has been reset.");
    }

    async AuthcreateAccount({ email, password, name }) {
    try {
        const userId = ID.unique();

        // Create user in Appwrite Auth
        const userAccount = await this.account.create(
            userId,
            email,
            password,
            name
        );

        if (userAccount) {
            // ✅ Create document in Users collection
            await this.account.createEmailPasswordSession(email, password);
            await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteUsersCollectionId,
                userId, // use same ID as Auth user
                {
                    Name: name,
                    Email: email,
                    Status: "active", // default value
                    CreatedAt: new Date().toISOString()
                }
            );

            // ✅ Fetch current user details (important for Redux/dashboard)
            const currentUser = await this.account.get();

            return currentUser;
            } else {
                return null;
            }
        } catch (error) {
            if (error.message.includes("Rate limit")) {
            // ✅ Flush the client if rate limit occurs
                this.resetClient();
            }
            throw error;
        }
    }

    async AuthLogin({ email, password }) {
        try {
            await this.account.createEmailPasswordSession(email, password);
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.error("Error logging in:", error);
            throw error;
        }
    }

    async AuthgetCurrentUser() {
        try {
            const user = await this.account.get();
            return user;
        } catch (error) {
            console.error("Error getting current user:", error);
            throw error;
        }
    }

    async AuthLogout() {
        try {
            await this.account.deleteSessions();
            return true;
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }

    async deleteAccount() {
        try {
            await this.account.delete();
        } catch (error) {
            console.error("Error deleting account:", error);
            throw error;
        }
    }
};

const authService = new AuthService();
export default authService;