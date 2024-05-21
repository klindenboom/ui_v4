// src/sentry.js

import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

// Initialize error handling 
Sentry.init({ dsn: "https://ae9348019d4d4a1eb7ae95f167c75731@o4505525970337792.ingest.sentry.io/4505525972172800" });

