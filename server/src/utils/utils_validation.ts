class ValidateExec {
	isString(val: any): boolean {
		return typeof val === "string";
	}
	isNumber(val: any): boolean {
		return typeof val === "number";
	}
	isArray(val: any): boolean {
		return Array.isArray(val);
	}
	isObject(val: any): boolean {
		return typeof val === "object";
	}
	isEmptyObject(val: any): boolean {
		if (!this.isObject(val)) {
			throw new Error(`Not an object: ${typeof val}`);
		} else {
			return !Object.keys(val).length;
		}
	}
	isEmptyArray(val: any): boolean {
		if (!this.isArray(val)) {
			throw new Error(`Not an array: ${typeof val}`);
		} else {
			return !val.length;
		}
	}
	isGuid(val: any): boolean {
		if (!this.isString(val)) {
			throw new Error(`Not a guid (string): ${typeof val}`);
		} else {
			const reg =
				/^((\w|\d){1,})-((\w|\d){1,})-((\w|\d){1,})-((\w|\d){1,})-((\w|\d){1,})/gm;
			return reg.test(val);
		}
	}
	minLength(val: any, min: number): boolean {
		const length = val.length;
		return length >= min;
	}
	maxLength(val: any, max: number): boolean {
		const length = val.length;
		return length <= max;
	}
	length(val: any, required: number) {
		return val.length >= required;
	}
}

type VType = "string" | "number" | "array" | "object" | "guid";

interface SchemaItem {
	type: VType;
	name: string;
}

interface Schema {
	[propertyName: string]: SchemaItem;
}

class SchemaValidator {
	#schema: Schema;
	#value: object;
	#errors: Array<object>;
	constructor(value: object, schema: Schema) {
		this.#value = value;
		this.#schema = schema;
		this.#errors = [];
	}
	#lookupSchema(key: string): SchemaItem {
		const itemSchema: SchemaItem = this.#schema[key];
		return itemSchema;
	}
	validateSchema() {}
	validate() {
		for (const [key, val] of Object.entries(this.#value)) {
			const schemaItem: SchemaItem = this.#lookupSchema(key);
			const { type, name } = schemaItem;
			if (key !== name) return false;
			const isValid = typeof val === type;
			if (!isValid) {
				this.#errors.push({
					propertyName: key,
					message: `Expected: ${type}; Received: ${typeof val}`,
				});
			}
		}
	}
}

export { ValidateExec };
