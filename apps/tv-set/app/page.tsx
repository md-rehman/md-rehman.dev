import styles from "./page.module.css";
import { TvSetNavigator } from "../components";

export default function Home() {
  return (
    <div className={styles.page}>
      TV SET
      <TvSetNavigator />
    </div>
  );
}
