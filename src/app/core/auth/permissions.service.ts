import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Permission {
  module: string;
  action: string;
  allowed: boolean;
}

export interface RolePermissions {
  role: string;
  permissions: {
    // Contratos
    contratos_view: boolean;
    contratos_create: boolean;
    contratos_edit: boolean;
    contratos_delete: boolean;
    contratos_execute: boolean;
    
    // Suplementos
    suplementos_view: boolean;
    suplementos_create: boolean;
    suplementos_edit: boolean;
    suplementos_delete: boolean;
    suplementos_execute: boolean;
    
    // Proveedores
    proveedores_view: boolean;
    proveedores_create: boolean;
    proveedores_edit: boolean;
    proveedores_delete: boolean;
    
    // Mi Entidad
    entidad_view: boolean;
    entidad_edit: boolean;
    entidad_delete: boolean;
    
    // Sistema
    backup_restore: boolean;
    users_manage: boolean;
    
    // Acciones generales
    export: boolean;
    print: boolean;
    
    // Ejecución financiera
    facturas_manage: boolean;
    cobros_manage: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private currentPermissions = new BehaviorSubject<RolePermissions | null>(null);
  public permissions$ = this.currentPermissions.asObservable();

  // Definición de permisos por rol
  private rolePermissions: { [key: string]: RolePermissions } = {
    'visor': {
      role: 'visor',
      permissions: {
        contratos_view: true,
        contratos_create: false,
        contratos_edit: false,
        contratos_delete: false,
        contratos_execute: false,
        
        suplementos_view: true,
        suplementos_create: false,
        suplementos_edit: false,
        suplementos_delete: false,
        suplementos_execute: false,
        
        proveedores_view: true,
        proveedores_create: false,
        proveedores_edit: false,
        proveedores_delete: false,
        
        entidad_view: false,
        entidad_edit: false,
        entidad_delete: false,
        
        backup_restore: false,
        users_manage: false,
        
        export: true,
        print: true,
        
        facturas_manage: false,
        cobros_manage: false
      }
    },
    
    'operador': {
      role: 'operador',
      permissions: {
        contratos_view: true,
        contratos_create: true,
        contratos_edit: true,
        contratos_delete: false,
        contratos_execute: false,
        
        suplementos_view: true,
        suplementos_create: true,
        suplementos_edit: true,
        suplementos_delete: false,
        suplementos_execute: false,
        
        proveedores_view: true,
        proveedores_create: true,
        proveedores_edit: true,
        proveedores_delete: false,
        
        entidad_view: false,
        entidad_edit: false,
        entidad_delete: false,
        
        backup_restore: false,
        users_manage: false,
        
        export: true,
        print: true,
        
        facturas_manage: false,
        cobros_manage: false
      }
    },
    
    'ejecutor': {
      role: 'ejecutor',
      permissions: {
        contratos_view: true,
        contratos_create: false,
        contratos_edit: false,
        contratos_delete: false,
        contratos_execute: true,
        
        suplementos_view: true,
        suplementos_create: false,
        suplementos_edit: false,
        suplementos_delete: false,
        suplementos_execute: true,
        
        proveedores_view: true,
        proveedores_create: false,
        proveedores_edit: false,
        proveedores_delete: false,
        
        entidad_view: false,
        entidad_edit: false,
        entidad_delete: false,
        
        backup_restore: false,
        users_manage: false,
        
        export: true,
        print: true,
        
        facturas_manage: true,
        cobros_manage: true
      }
    },
    
    'administrador': {
      role: 'administrador',
      permissions: {
        contratos_view: true,
        contratos_create: false,
        contratos_edit: false,
        contratos_delete: true,
        contratos_execute: false,
        
        suplementos_view: true,
        suplementos_create: false,
        suplementos_edit: false,
        suplementos_delete: true,
        suplementos_execute: false,
        
        proveedores_view: true,
        proveedores_create: false,
        proveedores_edit: false,
        proveedores_delete: true,
        
        entidad_view: true,
        entidad_edit: true,
        entidad_delete: true,
        
        backup_restore: true,
        users_manage: true,
        
        export: true,
        print: true,
        
        facturas_manage: false,
        cobros_manage: false
      }
    },
    
    'super_admin': {
      role: 'super_admin',
      permissions: {
        contratos_view: true,
        contratos_create: true,
        contratos_edit: true,
        contratos_delete: true,
        contratos_execute: true,
        
        suplementos_view: true,
        suplementos_create: true,
        suplementos_edit: true,
        suplementos_delete: true,
        suplementos_execute: true,
        
        proveedores_view: true,
        proveedores_create: true,
        proveedores_edit: true,
        proveedores_delete: true,
        
        entidad_view: true,
        entidad_edit: true,
        entidad_delete: true,
        
        backup_restore: true,
        users_manage: true,
        
        export: true,
        print: true,
        
        facturas_manage: true,
        cobros_manage: true
      }
    }
  };

  constructor() {
    // Inicializar con rol por defecto si es necesario
    this.setUserRole('visor');
  }

  setUserRole(role: string): void {
    const permissions = this.rolePermissions[role];
    if (permissions) {
      this.currentPermissions.next(permissions);
    } else {
      console.warn(`Rol no reconocido: ${role}`);
      this.currentPermissions.next(null);
    }
  }

  // Métodos de verificación de permisos
  hasPermission(permission: keyof RolePermissions['permissions']): boolean {
    const current = this.currentPermissions.value;
    return current ? current.permissions[permission] : false;
  }

  canViewContratos(): boolean {
    return this.hasPermission('contratos_view');
  }

  canCreateContratos(): boolean {
    return this.hasPermission('contratos_create');
  }

  canEditContratos(): boolean {
    return this.hasPermission('contratos_edit');
  }

  canDeleteContratos(): boolean {
    return this.hasPermission('contratos_delete');
  }

  canExecuteContratos(): boolean {
    return this.hasPermission('contratos_execute');
  }

  canViewSuplementos(): boolean {
    return this.hasPermission('suplementos_view');
  }

  canCreateSuplementos(): boolean {
    return this.hasPermission('suplementos_create');
  }

  canEditSuplementos(): boolean {
    return this.hasPermission('suplementos_edit');
  }

  canDeleteSuplementos(): boolean {
    return this.hasPermission('suplementos_delete');
  }

  canExecuteSuplementos(): boolean {
    return this.hasPermission('suplementos_execute');
  }

  canViewProveedores(): boolean {
    return this.hasPermission('proveedores_view');
  }

  canCreateProveedores(): boolean {
    return this.hasPermission('proveedores_create');
  }

  canEditProveedores(): boolean {
    return this.hasPermission('proveedores_edit');
  }

  canDeleteProveedores(): boolean {
    return this.hasPermission('proveedores_delete');
  }

  canViewEntidad(): boolean {
    return this.hasPermission('entidad_view');
  }

  canEditEntidad(): boolean {
    return this.hasPermission('entidad_edit');
  }

  canDeleteEntidad(): boolean {
    return this.hasPermission('entidad_delete');
  }

  canBackupRestore(): boolean {
    return this.hasPermission('backup_restore');
  }

  canManageUsers(): boolean {
    return this.hasPermission('users_manage');
  }

  canExport(): boolean {
    return this.hasPermission('export');
  }

  canPrint(): boolean {
    return this.hasPermission('print');
  }

  canManageFacturas(): boolean {
    return this.hasPermission('facturas_manage');
  }

  canManageCobros(): boolean {
    return this.hasPermission('cobros_manage');
  }
}