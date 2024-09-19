import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment:
    process.env.REACT_APP_PRODUCTION === 'true' ? 'production' : 'development',
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: [process.env.REACT_APP_SERVER_URL],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
