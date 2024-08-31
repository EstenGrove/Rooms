import { useRef, useEffect } from "react";

export interface SSEOptions {
	deferSetup?: boolean;
	onMessage: (msg: MessageEvent) => void;
	onError?: (msg: Event) => void;
	onOpen?: (msg: Event) => void;
	onClose?: () => void;
}

export interface HookReturn {
	eventSource: EventSource;
	open: () => void;
	close: () => void;
}

// NOTES:
// - Might need to actually set it up onMount instead

const setupEvents = (eventSource: EventSource, actions: SSEOptions): void => {
	const { onMessage, onError, onOpen } = actions;
	if (eventSource) {
		const source = eventSource as EventSource;

		source.onmessage = (msg: MessageEvent) => {
			if (onMessage) {
				onMessage(msg);
			}
		};
		source.onerror = (err: Event) => {
			if (onError) {
				onError(err);
			}
		};
		source.onopen = (msg: Event) => {
			if (onOpen) {
				onOpen(msg);
			}
		};
	}
};

const useSSE = (srcUrl: URL | string, actions: SSEOptions): HookReturn => {
	const { deferSetup = true, onClose } = actions;
	const eventSource = useRef<EventSource>();

	// open the connection & setup our events & store it in a ref
	const open = (): void => {
		const source: EventSource = new EventSource(srcUrl);
		eventSource.current = source;

		setupEvents(source, actions);
	};

	// close the connection
	const close = (): void => {
		const source = eventSource.current as EventSource;

		source.close();

		if (onClose) {
			onClose();
		}
	};

	// if we want to connect immediately call the 'open()' fn
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (!deferSetup) {
			open();
		}

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		eventSource: eventSource.current as EventSource,
		close: close,
		open: open,
	};
};

export { useSSE };
