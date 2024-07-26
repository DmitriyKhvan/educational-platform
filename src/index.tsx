import { ApolloProvider } from "@apollo/client";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import App from "./app/App";

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "src/app/providers/auth-provider";
import client from "src/shared/config/apollo/client";
import i18next from "src/shared/config/i18n/i18n";
import { ErrorBoundary } from "./app/providers/error-boundary";
import { NotificationProvider } from "./app/providers/notification-provider";

import "src/app/styles/global.scss";
import { CurrencyProvider } from "./app/providers/currency-provider";

const root = createRoot(document.getElementById("root"));
root.render(
	<ApolloProvider client={client}>
		<I18nextProvider i18n={i18next}>
			<CurrencyProvider>
				<NotificationProvider>
					<AuthProvider>
						<BrowserRouter>
							<ErrorBoundary>
								<App />
							</ErrorBoundary>
						</BrowserRouter>
					</AuthProvider>
				</NotificationProvider>
			</CurrencyProvider>
		</I18nextProvider>
	</ApolloProvider>,
);
