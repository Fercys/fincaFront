export class farmModels {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude:number;
    postalAddress:string;
    account:{
        id:number;
        name:string;
    }
    timeZone:string;
    webhook:boolean;
 }