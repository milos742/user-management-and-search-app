import axios from 'axios';
import { User } from '../../types/users';

export class UsersApi {
    baseUrl: any;
    constructor(baseUrl = 'https://jsonplaceholder.typicode.com') {
        this.baseUrl = baseUrl;
    }

    async getUsers(): Promise<User[]> {
        return await axios.get(`${this.baseUrl}/users`);
    }
}
