import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Home from "./pages/Home";
import Room from "./pages/Room";
import YourRooms from "./pages/YourRooms";
import UserHome from "./components/users/UserHome";
import Dashboard from "./pages/Dashboard";
import YourSettings from "./pages/YourSettings";
import RoomSession from "./pages/RoomSession";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
	return (
		<Router>
			<Provider store={store}>
				<div className="App">
					<Routes>
						<Route index={true} path="/" element={<Home />} />
						{/* PUBLIC ROOM SESSION */}
						<Route path="sessions/:id" element={<RoomSession />} />
						{/* PRIVATE ROUTES */}
						{/* <Route path="dashboard" element={<Dashboard />}> */}
						<Route path="dashboard" element={<Dashboard />}>
							<Route path="user/" element={<UserHome />} />
							<Route path="rooms/" element={<YourRooms />} />
							<Route path="rooms/:id" element={<Room />} />
							<Route path="settings" element={<YourSettings />} />
							<Route path="sessions/:id" element={<RoomSession />} />
							{/* <Route path="settings/room/*" element={<RoomSettings />} /> */}
						</Route>
					</Routes>
				</div>
			</Provider>
		</Router>
	);
}

export default App;
