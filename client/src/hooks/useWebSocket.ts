import { useRef, useEffect } from "react";

export interface WSOptions {
	deferConnect?: boolean;
	onMessage: (msg: MessageEvent) => void;
	onClose?: (code: CloseEvent) => void;
	onConnect?: (event: Event) => void;
	onError?: (event: Event) => void;
	onTerminate?: () => void;
}

const useWebSocket = (url: string, options: WSOptions) => {
	const {
		deferConnect = true,
		onMessage,
		onConnect,
		onClose,
		onError,
		onTerminate,
	} = options;
	const wss = useRef<WebSocket>();

	// sets up connection & event handlers
	const setup = () => {
		const wsConnection = new WebSocket(url);
		// add event listeners
		wsConnection.onopen = (event: Event) => {
			if (onConnect) onConnect(event);
		};
		wsConnection.onclose = (event: CloseEvent) => {
			if (onClose) onClose(event);
		};
		wsConnection.onmessage = (msg: MessageEvent) => {
			if (onMessage) onMessage(msg);
		};
		wsConnection.onerror = (event: Event) => {
			if (onError) onError(event);
		};

		wss.current = wsConnection as WebSocket;
	};

	const send = (type: string, msg: object) => {
		if (!wss.current) {
			throw new Error("WSS Connection is required to send data!");
		}
		const socket = wss.current as WebSocket;
		const data = {
			type: type,
			data: msg,
		};
		socket.send(JSON.stringify(data));
	};

	const terminate = () => {
		if (!wss.current) {
			throw new Error("WSS Connection is required to terminate!");
		}

		const socket = wss.current as WebSocket;
		socket.close();

		if (onTerminate) onTerminate();
	};

	// setup connections & events, if not deferred
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (!deferConnect) {
			setup();
		}

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		wss: wss.current as WebSocket,
		send: send,
		connect: setup,
		disconnect: terminate,
	};
};

export { useWebSocket };
