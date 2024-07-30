import { Database as SqliteDatabase, RunResult } from 'sqlite3';
import { notNullOrUndefined } from './index';

const DB_DEFAULT_FILENAME = ':memory:';

export default class Database extends SqliteDatabase {
    static _instance: Database;

    constructor(filename?: string) {
        if (Database._instance !== undefined) {
            throw new Error('Database instance already exists.');
        }

        super(filename ?? DB_DEFAULT_FILENAME);
        Database._instance = this;
        this.serialize(() => {
            this.run(`CREATE TABLE IF NOT EXISTS beers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT DEFAULT "",
                    type TEXT DEFAULT "",
                    rating_sum INTEGER NOT NULL DEFAULT 0,
                    rating_count INTEGER NOT NULL DEFAULT 0,
                    created_on TEXT DEFAULT CURRENT_TIMESTAMP,
                    updated_on TEXT DEFAULT CURRENT_TIMESTAMP
                )`);
        });
        return Database._instance;
    }

    static init(filename: string) {
        new Database(filename);
    }

    static getInstance(): Database {
        if (this._instance === undefined) {
            new Database();
        }

        return this._instance;
    }

    runSql(sql: string, params: any[]): Promise<RunResult> {
        return new Promise<RunResult>((resolve, reject) => {
            this.run(sql, params, function (error: Error | null) {
                if (notNullOrUndefined(error)) {
                    reject(error);
                }

                resolve(this);
            });
        });
    }

    getOne<T = unknown>(sql: string, params: any[]): Promise<T> {
        return new Promise((resolve, reject) => {
            this.get<T>(sql, params, (error, row) => {
                if (notNullOrUndefined(error)) {
                    throw error;
                }

                resolve(row);
            });
        });
    }

    getValues<T = unknown>(sql: string, params: any[] = []): Promise<T[]> {
        return new Promise((resolve, reject) => {
            this.all<T>(sql, params, (error: Error | null, rows: T[]) => {
                if (notNullOrUndefined(error)) {
                    throw error;
                }

                resolve(rows);
            });
        });
    }
}
