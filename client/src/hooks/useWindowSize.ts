import { useEffect, useMemo, useState } from "react";

interface WindowSize {
	width: number;
	height: number;
}

const useWindowSize = () => {
	const [windowSize, setWindowSize] = useState<WindowSize>({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		const onResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener("resize", onResize);

		return () => {
			isMounted = false;
			window.removeEventListener("resize", onResize);
		};
	}, []);

	return useMemo(() => windowSize, [windowSize]);
};

export { useWindowSize };
