import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import aiStudioConfig from '../../firebase-applet-config.json';

const isProd = import.meta.env.PROD;

// In production every value MUST come from environment variables.
// In development we fall back to the local applet config file.
const apiKey     = import.meta.env.VITE_FIREBASE_API_KEY     || (!isProd ? aiStudioConfig.apiKey     : undefined);
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || (!isProd ? aiStudioConfig.authDomain : undefined);
const projectId  = import.meta.env.VITE_FIREBASE_PROJECT_ID  || (!isProd ? aiStudioConfig.projectId  : undefined);

if (!apiKey || !authDomain || !projectId) {
  const msg = isProd
    ? 'Missing required Firebase environment variables. The app cannot start.'
    : 'Firebase config is incomplete. Set environment variables or provide firebase-applet-config.json.';
  throw new Error(msg);
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || (!isProd ? aiStudioConfig.storageBucket     : undefined),
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (!isProd ? aiStudioConfig.messagingSenderId : undefined),
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              || (!isProd ? aiStudioConfig.appId              : undefined),
};

const databaseId =
  import.meta.env.VITE_FIREBASE_DATABASE_ID ||
  (!isProd ? (aiStudioConfig as any).firestoreDatabaseId : undefined) ||
  '(default)';

// Always initialise with an explicit app instance so we can never accidentally
// bind Auth or Firestore to the wrong project.
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app, databaseId);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST   = 'list',
  GET    = 'get',
  WRITE  = 'write',
}

/**
 * Logs a Firestore error without leaking sensitive user/auth metadata,
 * then re-throws so callers can show a user-friendly message.
 */
export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null,
): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error('Firestore error', { operationType, path, message });
  throw new Error(message);
}
