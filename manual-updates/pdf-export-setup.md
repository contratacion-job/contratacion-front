To add a "Download PDF" button to all tables in the system similar to the contrato-list component, the following steps are recommended:

1. Identify all components with tables (e.g., Angular Material MatTable).
2. For each table component:
   - Add a PDF export button in the component's HTML next to the CSV export button.
   - Import jsPDF and jsPDF-AutoTable libraries in the component TypeScript file.
   - Add an exportToPDF() method that generates a PDF from the filtered data.
   - Use the jsPDF-AutoTable plugin to format the table data in the PDF.
3. Ensure npm packages jspdf and jspdf-autotable are installed in the project.
4. Test each component's PDF export button to verify correct PDF generation.

This approach standardizes PDF export functionality across all tables in the system, improving user experience and consistency.

The UsuarioGestionComponent is one such component identified with a table. The PDF export method and button should be added there following the pattern used in contrato-list.component.

Repeat this process for other table components as needed.
