import {
	Outlet,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Room from "./pages/Room";
import YourRooms from "./pages/YourRooms";
import { Provider } from "react-redux";
import { store } from "./store/store";
import UserHome from "./components/users/UserHome";
import Dashboard from "./pages/Dashboard";
import YourSettings from "./pages/YourSettings";

function App() {
	return (
		<Router>
			<Provider store={store}>
				<div className="App">
					<Routes>
						<Route index={true} path="/" element={<Home />} />
						<Route path="dashboard" element={<Dashboard />}>
							<Route path="user/" element={<UserHome />} />
							<Route path="rooms/" element={<YourRooms />} />
							<Route path="rooms/:id" element={<Room />} />
							<Route path="settings" element={<YourSettings />} />
							{/* <Route path="settings/room/*" element={<RoomSettings />} /> */}
						</Route>
					</Routes>
				</div>
			</Provider>
		</Router>
	);
}

export default App;
