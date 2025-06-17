export interface User
{
    id: string;
    name: string;
    username: string;
    avatar?: string;
    status?: string;
    roles?: string[]; // Added roles property to support role-based access control
}
