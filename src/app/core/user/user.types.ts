export interface User
{
    id: string;
    username: string;
    avatar?: string;
    status?: string;
    roles?: string[];
    password: string;
    name: string;
    apellidos: string;
    cargo: string;
    correo: string;
    movil: number;
    extension: number;// Added roles property to support role-based access control
}
