const isError = (err: any): err is NodeJS.ErrnoException => {
	return err instanceof Error;
};

// Checks that the error is of a specific type: eg. a custom error class like: HTTPError
const isErrorType = <T extends new (...args: any) => Error>(
	err: any,
	ErrorType: T
): err is InstanceType<T> & NodeJS.ErrnoException => {
	return isError(err) && err instanceof ErrorType;
};

class UserNotFoundError extends Error {
	constructor(msg: string = "User account not found.") {
		super(msg);
	}
}
class InvalidCredsError extends Error {
	constructor(msg: string = "Incorrect login info.") {
		super(msg);
	}
}

export { isError, isErrorType, InvalidCredsError, UserNotFoundError };
