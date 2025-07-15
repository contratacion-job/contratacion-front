import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class FuseValidators
{
    /**
     * Check for empty (optional fields) values
     *
     * @param value
     */
    static isEmptyInputValue(value: any): boolean
    {
        return value == null || value.length === 0;
    }

    /**
     * Must match validator
     *
     * @param controlPath A dot-delimited string values that define the path to the control.
     * @param matchingControlPath A dot-delimited string values that define the path to the matching control.
     */
    static mustMatch(controlPath: string, matchingControlPath: string): ValidatorFn
    {
        return (formGroup: AbstractControl): ValidationErrors | null =>
        {
            // Get the control and matching control
            const control = formGroup.get(controlPath);
            const matchingControl = formGroup.get(matchingControlPath);

            // Return if control or matching control doesn't exist
            if ( !control || !matchingControl )
            {
                return null;
            }

            // Delete the mustMatch error to reset the error on the matching control
            if ( matchingControl.hasError('mustMatch') )
            {
                delete matchingControl.errors.mustMatch;
                matchingControl.updateValueAndValidity();
            }

            // Don't validate empty values on the matching control
            // Don't validate if values are matching
            if ( this.isEmptyInputValue(matchingControl.value) || control.value === matchingControl.value )
            {
                return null;
            }

            // Prepare the validation errors
            const errors = {mustMatch: true};

            // Set the validation error on the matching control
            matchingControl.setErrors(errors);

            // Return the errors
            return errors;
        };
    }

    /**
     * Validador para teléfono móvil con prefijo +53 y 8 dígitos después
     */
    static telefonoMovilValidator(): ValidatorFn
    {
        return (control: AbstractControl): ValidationErrors | null =>
        {
            const value = control.value;
            if (this.isEmptyInputValue(value))
            {
                return null; // No validar si está vacío
            }
            // Validar que empiece con +53 y luego 8 dígitos, sin letras
            const regex = /^\+53[0-9]{8}$/;
            const valid = regex.test(value);
            return valid ? null : { telefonoMovilInvalido: true };
        };
    }
    static telefonoValidator(): ValidatorFn
    {
        return (control: AbstractControl): ValidationErrors | null =>
        {
            const value = control.value;
            if (this.isEmptyInputValue(value))
            {
                return null; // No validar si está vacío
            }
            // Validar que empiece con +53 y luego 8 dígitos, sin letras
            const regex = /^\+22[0-9]{6}$/;
            const valid = regex.test(value);
            return valid ? null : { telefonoMovilInvalido: true };
        };
    }

    /**
     * Función para capitalizar la primera letra de cada palabra en un texto
     */
    static capitalizarTexto(texto: string): string
    {
        if (!texto) return texto;
        return texto.replace(/\b\w/g, (letra) => letra.toUpperCase());
    }
}
