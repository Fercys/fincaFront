export class User {
    id: number;
    name: string;
    last_name: string;
    email: string;
    business: string;
    office: string; 
    id_role: number;
    region:string;
    city:string;
    phone:string;
    password: string;
    password_confirmation: string;
    active:number;
    new_msj_notification:number;
    new_alert_notification:number;
    new_zone_notification:number;
    create_at: Date;
    updated_at: Date;
}