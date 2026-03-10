import {
  PublicClientApplication,
  type AccountInfo,
  type AuthenticationResult,
  type SilentRequest,
} from "@azure/msal-browser";

const clientId = import.meta.env.VITE_AZURE_AD_CLIENT_ID;
const tenantId = import.meta.env.VITE_AZURE_AD_TENANT_ID;
export const isMsalConfigured = Boolean(clientId && tenantId);

const authority = tenantId
  ? `https://login.microsoftonline.com/${tenantId}`
  : "https://login.microsoftonline.com/common";

const resolveRedirectUri = () => {
  const configuredRedirectUri = import.meta.env.VITE_AZURE_AD_REDIRECT_URI;

  if (configuredRedirectUri) {
    try {
      return new URL(configuredRedirectUri).toString();
    } catch {
      return new URL(configuredRedirectUri, window.location.origin).toString();
    }
  }

  return window.location.href;
};

const redirectUri = resolveRedirectUri();

const apiScope = import.meta.env.VITE_AZURE_AD_API_SCOPE;
const scopes = apiScope ? [apiScope] : ["User.Read"];

export const AZURE_TOKEN_STORAGE_KEY = "azureAdJwt";

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: clientId || "00000000-0000-0000-0000-000000000000",
    authority,
    redirectUri,
    postLogoutRedirectUri: redirectUri,
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
});

export const loginRequest = {
  scopes,
};

export const persistAccessToken = (jwt: string) => {
  sessionStorage.setItem(AZURE_TOKEN_STORAGE_KEY, jwt);
};

export const clearPersistedAccessToken = () => {
  sessionStorage.removeItem(AZURE_TOKEN_STORAGE_KEY);
};

export const getPersistedAccessToken = () => {
  return sessionStorage.getItem(AZURE_TOKEN_STORAGE_KEY);
};

export const resolveActiveAccount = () => {
  let activeAccount = msalInstance.getActiveAccount();

  if (!activeAccount) {
    const allAccounts = msalInstance.getAllAccounts();
    activeAccount = allAccounts[0] ?? null;
    if (activeAccount) {
      msalInstance.setActiveAccount(activeAccount);
    }
  }

  return activeAccount;
};

export const acquireAccessToken = async (account?: AccountInfo | null) => {
  if (!isMsalConfigured) {
    return null;
  }

  const activeAccount = account ?? resolveActiveAccount();

  if (!activeAccount) {
    return null;
  }

  const silentRequest: SilentRequest = {
    scopes,
    account: activeAccount,
  };

  const response: AuthenticationResult =
    await msalInstance.acquireTokenSilent(silentRequest);

  if (response.accessToken) {
    persistAccessToken(response.accessToken);
  }

  return response;
};
