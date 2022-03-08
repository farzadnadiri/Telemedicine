export interface IPrescription {
    patient: string;
    visit: string;
    directVisit: boolean;
    diagnosis: any[];
    medicines: any[];
    experiments: any[];
    note:string;
    advice:string;
    nextVisit:string;
    visitDone:boolean;
  }
  