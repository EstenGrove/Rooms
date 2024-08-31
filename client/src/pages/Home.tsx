import styles from "../css/pages/Home.module.scss";
import GetStarted from "../components/home/GetStarted";

const Home = () => {
	return (
		<div className={styles.Home}>
			<div className={styles.Home_inner}>
				<GetStarted />
			</div>
		</div>
	);
};

export default Home;
