import { Pool, QueryResult } from "pg";
import { SQLite3DB } from "../db/db";

export interface CardSvcResult {
	card_id: number;
	card_name: string;
	card_points: number;
	is_active: boolean;
	created_date: string;
	updated_date: string | null;
}

class CardsService {
	#db: Pool;
	constructor(db: Pool) {
		this.#db = db;
	}
	async getDeck(deckID: number): Promise<CardSvcResult[] | unknown> {
		try {
			const query = `SELECT * FROM get_card_deck($1)`;
			const results = (await this.#db.query(query, [deckID])) as QueryResult;
			const rows = results?.rows as CardSvcResult[];
			return rows;
		} catch (error) {
			return error;
		}
	}
	async updateCard(
		cardID: number,
		cardName: string,
		points: number
	): Promise<CardsService | unknown> {
		try {
			const query = `
        UPDATE vote_cards
        SET
          card_name = $1,
          card_points = $2
        WHERE card_id = $3
        RETURNING *;
      `;
			const results = (await this.#db.query(query, [
				cardName,
				points,
				cardID,
			])) as QueryResult;
			const updatedCard = results?.rows?.[0] as CardSvcResult;
			return updatedCard;
		} catch (error) {
			return error;
		}
	}
}

export { CardsService };
