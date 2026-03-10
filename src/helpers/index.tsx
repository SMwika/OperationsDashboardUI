import { IFilterState, IResponse } from "@/interfaces";
import Loader from "../components/common/Loader";
import { redirection } from "@/store/common/common.actions.ts";
import { AppDispatch } from "@/store";
import CryptoJS from "crypto-js";
import {
  clearPersistedAccessToken,
  isMsalConfigured,
  loginRequest,
  msalInstance,
} from "@/auth/msal";
import { PATH } from "@/constants";

export const nFormatter = (num: number, digits: number): string => {
  const lookup: { value: number; symbol: string }[] = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;

  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);

  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};

export const handleApiResponse = (
  response: IResponse,
  fullResponse?: boolean,
) => {
  if (response.error) {
    clearPersistedAccessToken();

    if (isMsalConfigured) {
      void msalInstance.loginRedirect(loginRequest);
      return;
    }

    const basePath = import.meta.env.DEV ? PATH : "";
    window.location.href = `${basePath}/web/login`;
  } else {
    if (response.result.status === "failed") {
      throw new Error(response.result.error || "Unknown error");
    } else {
      return fullResponse ? response.result : response.result.data;
    }
  }
};

export const getSkeleton = () => {
  return (
    <Loader height={670} width='100%'>
      <rect x='0' y={0} rx='4' ry='4' width='60%' height='80px' />

      <rect x='0' y={88} rx='4' ry='4' width='30%' height='40px' />

      <rect x='0' y={136} rx='4' ry='4' width='32%' height='360px' />
      <rect x='33%' y={136} rx='4' ry='4' width='32%' height='360px' />
      <rect x='66%' y={136} rx='4' ry='4' width='32%' height='360px' />

      <rect x='0' y={368 + 136} rx='4' ry='4' width='32%' height='360px' />
      <rect x='33%' y={368 + 136} rx='4' ry='4' width='32%' height='360px' />
      <rect x='66%' y={368 + 136} rx='4' ry='4' width='32%' height='360px' />
    </Loader>
  );
};

export const generateSitesInfoPayload = (
  filtersState: IFilterState,
  systemTypes: number[],
) => {
  return {
    filter: generatePayload(filtersState, systemTypes),
  };
};
export const generateFiltersPayload = (filtersState: IFilterState) => {
  return {
    filter: Object.keys(filtersState).reduce(
      (acc, item) => {
        acc[transformKeys(item)] = Object.values(filtersState[item] || {}) as (
          | string
          | number
        )[];
        return acc;
      },
      {} as Record<string, (string | number)[]>,
    ),
  };
};

export const generatePayload = (
  filtersState: IFilterState,
  systemTypes: number[],
) => {
  return Object.keys(filtersState).reduce(
    (acc, item) => {
      acc[item] = Object.values(filtersState[item] || {}) as (
        | string
        | number
      )[];
      return acc;
    },
    { system_types: systemTypes } as Record<string, (string | number)[]>,
  );
};

export const getStatusClassname = (status: string) => {
  switch (status) {
    case "":
    case "Rejected":
    case "Canceled":
      return "error";
    case "In progress":
      return "in-progress";
    case "Completed":
    case "Approved":
    case "Active":
      return "success";
    case "Pending":
      return "pending";
    case "On hold":
    case "Inactive":
      return "on-hold";
    case "Waiting":
      return "waiting";
    case "Scheduled":
      return "scheduled";
    default:
      return "default";
  }
};

export const getProgressClassname = (
  value: number,
): "green" | "yellow" | "red" => {
  if (value >= 70) {
    return "green";
  } else if (value >= 40) {
    return "yellow";
  } else {
    return "red";
  }
};

export const doRedirect = ({
  key,
  Id,
  model,
  filtersState,
  dispatch,
  systemTypes,
}: {
  key?: string;
  Id?: number;
  model: string;
  filtersState: IFilterState;
  dispatch: AppDispatch;
  systemTypes?: number[];
}) => {
  const payload = {
    model,
    ...(systemTypes
      ? generateSitesInfoPayload(filtersState, systemTypes)
      : generateFiltersPayload(filtersState)),
    ...(key ? { redirection_key: key } : { Id }),
  };

  dispatch(redirection(payload));
};

const transformKeys = (key: string): string => {
  switch (key) {
    case "milestone_status":
    case "fieldtask_status":
      return "status";
    default:
      return key;
  }
};

export const decryptData = (str: string) => {
  try {
    const ciphertext = CryptoJS.enc.Base64.parse(str);

    // Extract IV (Initialization Vector)
    const iv = ciphertext.clone();
    iv.sigBytes = 16;
    iv.clamp();

    // Remove IV from ciphertext
    ciphertext.words.splice(0, 4); // delete 4 words = 16 bytes
    ciphertext.sigBytes -= 16;

    // Define the decryption key
    const key = CryptoJS.enc.Utf8.parse("q#46safgjk#@skfn");

    // Create CipherParams object for decryption
    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext,
    });

    // Decrypt the data
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
      iv,
      mode: CryptoJS.mode.CFB,
    });

    // Convert decrypted bytes to string
    let data = decrypted.toString(CryptoJS.enc.Utf8);

    // Replace single quotes and parse to JSON
    data = data.replaceAll("u'", "'").replaceAll("'", '"');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Decryption failed:", error);
    return {};
  }
};

export const getHumanDate = (date: Date | string | null) => {
  return (
    date &&
    new Date(date).toLocaleString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
  );
};
