// In your component constructor or ngOnInit
this.filterForm = this._formBuilder.group({
    no_contrato_filter: [''],
    valor_cup_filter: [''],
    valor_usd_filter: [''],
    fecha_entrada_filter: [''],
    fecha_firmado_filter: [''],
    // ... other controls
});
