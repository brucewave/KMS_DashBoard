function tableToExcel() {
    
    var table2excel = new Table2Excel();
    table2excel.export(document.querySelectorAll("table"));
    table2excel.export(document.getElementById("parent-table"));
    table2excel.export(document.getElementById("teacher-table"));
    table2excel.export(document.getElementById("children-table"));
}