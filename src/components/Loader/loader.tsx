
import "@/components/loader/loader.css";

export default function Loader({ height }) {
	return (
		<div style={{ height }} className="loader_center">
			<div className="lds-roller">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</div>
	);
}
