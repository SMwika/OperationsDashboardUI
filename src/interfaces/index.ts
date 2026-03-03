export interface IKeyValue {
  [key: string]: { [key: string]: string | number } | undefined;
}

export interface ILookUp {
  system_types: { id: number; violation: boolean }[];
  [key: string]: any;
}

export interface IFilterState {
  [key: string]: {
    [key: string]: string | number;
  };
}


export interface IResponse {
  error?: any;
  result: {
    status: 'success' | 'failed';
    data: any;
    error: any;
  };
}

export interface IHeadCell {
  field: string;
  headerName: string;
  withOutSort?: boolean;
  hidden?: boolean;
}

export interface IProject {
  General: IProjectGeneral[]
  MyTasks: IProjectMyTask[]
  History: IProjectHistory
  UnifiedSystemCodes: IProjectUnifiedSystemCode[]
}

export interface IProjectGeneral {
  Progress: number
  Id: number
  "Activity Id": number
  "Site Id": string
  "Site Code": string
  Activities: string
  "System Type": string
  Region: string
  District: string
  City: string
  "Start Date": string
  "Current Milestone": string
  Vendor: any
  Aging: number
  Status: string
}

export interface IProjectMyTask {
  Id: number
  "Activity ID": number
  Milestone: string
  "System Type": string
  Plan: string
  Actual?: string
  Action: string
}

export interface IProjectHistory {
  Progress: number
  Items: {
    "Date Completed": string
    Aging: number
    Title: string
  }[]
}

export interface IProjectUnifiedSystemCode {
  Title: string
  Id: number
  "Site Id": string
  "Site Code": string
  "System Type": string
  Region: string
  "Current Milestone": string
  Vendor: any
  Status: string
  Direction: string
  Services: Service[]
  Components: any[]
}

export interface Service {
  Id: number
  Name: string
  Identifier: string
  Status: string
}

interface USCInformation {
  Name: string | null;
  "System Type": string | null;
  "System Category": string | null;
  "Site Code": string | null;
  Site: string | null;
  "Site Activity ID": number | null;
  "Technology Code": string | null;
  Direction: string | null;
  "Street Code": string | null;
  "Install Lane": string | null;
  "Additional Lanes": string | null;
  "Device No": string | null;
  "Service Codes": string | null;
  Manufacturer: string | null;
  "Install Location Code": string | null;
  "Fixed System Site": string | null;
  "Scope year": string | null;
  Generation: string | null;
  "Firmware Version": string | null;
  "System Trigger": string | null;
  Status: string | null;
  "Code Generation Status": string | null;
}

interface ServiceStatus {
  ID: number;
  "S#": string;
  "SERVICE NAME": string;
  IDENTIFIER: string;
  STATUS: string;
  "CREATED ON": string;
  "CREATED BY": string;
}

interface Component {
  COMPONENT: string;
  "SERIAL NUMBER": string;
  "ASBUILT STATUS": string;
}

interface HistoryEntry {
  Remark: string;
  "System Category": string;
  "Link Site"?: string | null;
  "CREATED ON": string;
  "CREATED BY": string;
}

export interface IUSCObject {
  "USC Information": USCInformation;
  "Service Status": ServiceStatus[];
  Components: Component[];
  History: HistoryEntry[];
  State: string;
}
