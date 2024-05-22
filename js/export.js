function tableToExcel() {
    
    var table2excel = new Table2Excel();
    table2excel.export(document.querySelectorAll("table"));
    
    var table2excel1 = new Table2Excel();
    table2excel1.export(document.getElementById("parent-table"));

    var table2excel2 = new Table2Excel();
    table2excel2.export(document.getElementById("teacher-table"));

    var table2excel3 = new Table2Excel();
    table2excel3.export(document.getElementById("children-table"));
}