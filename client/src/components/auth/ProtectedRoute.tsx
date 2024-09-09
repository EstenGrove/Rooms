import { ReactElement, ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { CurrentUser } from "../../features/auth/types";
import { Route, useNavigate } from "react-router-dom";

type Props = {
	path: string;
	element: ReactNode;
	children?: ReactElement;
};

const ProtectedRoute = ({
	path,
	element: Component,
	// children,
	...rest
}: Props) => {
	const navigate = useNavigate();
	const authedUser: CurrentUser = useSelector(selectCurrentUser);
	const isAuthed: boolean = true;

	if (!isAuthed) {
		navigate("/?tab=login");
		return null;
	}
	return <Route path={path} element={Component} {...rest} />;
};

export default ProtectedRoute;
