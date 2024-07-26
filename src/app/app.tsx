import Loader from "@/components/loader/loader";

import { useCurrency } from "@/app/providers/currency-provider";
import { AppRouter } from "@/app/providers/router";
import { Toaster } from "react-hot-toast";

function App() {
	const { loadingCurrency } = useCurrency();

	return (
		<>
			{loadingCurrency && (
				<div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
					<Loader />
				</div>
			)}
			<AppRouter />
			<Toaster />
		</>
	);
}

export default App;
