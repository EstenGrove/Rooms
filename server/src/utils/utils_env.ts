import dotenv from "dotenv";
dotenv.config();
import { PoolConfig } from "pg";

interface IApiUser {
	username: string;
	password: string;
}

const API_USER: IApiUser = {
	username: process.env.API_USER as string,
	password: process.env.API_USER_PWD as string,
};

export { API_USER };
