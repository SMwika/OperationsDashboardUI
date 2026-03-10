import activity from "@/assets/icons/activity.svg";
import workOrdersIcon from "@/assets/icons/work-orders.svg";
import invoice from "@/assets/icons/invoice.svg";
import forecastIcon from "@/assets/icons/forecast.svg";
import ThreeDIcon from "@/assets/icons/3d.svg";

import {
  ProjectIcon,
  SitesIcon,
  SurveyIcon,
} from "@/components/Icons/Icons.tsx";

export const API_URL = "/ntww_odp/";

export const SYS_TYPES = {
  Sites: { icon: SitesIcon, color: "blue" },
  Project: { icon: ProjectIcon, color: "red" },
  Activities: { icon: activity, color: "green" },
  "Work Orders": { icon: workOrdersIcon, color: "orange" },
  Invoices: { icon: invoice, color: "red" },
  Forecasts: { icon: forecastIcon, color: "violet" },
  "Field Tasks": { icon: SurveyIcon, color: "aqua" },
  "Unified System Code": { icon: SurveyIcon, color: "brown" },
  DMS: { icon: SurveyIcon, color: "brown" },
  Submittal: { icon: invoice, color: "green" },
  "CR Project": { icon: invoice, color: "green" },
  Misc: { icon: ThreeDIcon, color: "var(--color-grey-20)" },
};

export const PROGRESS_COLORS = {
  green: "#25c7bc",
  yellow: "#ff8800",
  red: "#f32641",
};

export const PATH = "/";
