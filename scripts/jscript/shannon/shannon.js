p// log_b(a) = ln(a)/ln(b)
function logb(number, base) {
    return Math.log(number)/Math.log(base);
}

var fso = new ActiveXObject('Scripting.FileSystemObject');

if(WScript.Arguments.Length < 1) {
    WSH.echo("��������� ���� ���� ������!");
    WScript.Quit(1);
}

var in_txt = WScript.Arguments(0);

if(!fso.FileExists(in_txt)) {
    WSH.echo("�� ������ " + in_txt);
    WScript.Quit(1);
}

var in_file = fso.OpenTextFile(in_txt);

var str = in_file.ReadAll();
var alp = new Array();

// ������� ������� ��������� �������� � ������
if(str.length == 0) {
    WSH.echo("Требуется строка для вычисления энтропии");
    WScript.Quit(1);
}

if(str.length == 1) {
    WSH.echo("Энтропия еденичной строки равна 0");
    WScript.Quit(0);
}
// Составление алфавита и подсчет частоты вхождения каждого символа из этого алфавита
for(i = 0; i < str.length; ++i) {
    alp[str.charAt(i)] = 0;
}
for(i = 0; i < str.length; ++i) {
    alp[str.charAt(i)]++;
}


var n = 0; for(key in alp)  n++;
// ���������� �������� �������
var shannon = 0;
for(key in alp) {
    var c = alp[key]/str.length;
    WSH.echo(key + " " + alp[key] + "/" + str.length + "=" + c);
    shannon += c * logb(c, n);
}
shannon = (-1)*shannon;
WSH.echo("�������� �������: " + shannon);
