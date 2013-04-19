if(WScript.Arguments.length < 3) {
    WSH.echo("��������� ��� ����� ��� �������, ��� ������ ��� ������� � �������� ������");
    WSH.echo("�Script code.js <dictionary> <input_data> <output_code>");
    WSH.quit(1);
}

var fso = new ActiveXObject('Scripting.FileSystemObject');

if(!fso.FileExists(WScript.Arguments(0))) {
    WSH.echo("�� ������ ���� �� ��������: " + WScript.Arguments(0));
    WSH.quit(1);
}

if(!fso.FileExists(WScript.Arguments(1))) {
    WSH.echo("�� ������ ���� � �������� �������: " + WScript.Arguments(1));
    WSH.quit(1);
}

var dictionary_stream = fso.OpenTextFile(WScript.Arguments(0));
var data_stream = fso.OpenTextFile(WScript.Arguments(1));
var code_stream = fso.CreateTextFile(WScript.Arguments(2));

// ������ �������
var dictionary = new Array();
while(!dictionary_stream.AtEndOfLine) {
    str = dictionary_stream.ReadLine();
    temp = new Array();
    temp = str.split(":");
    if(temp.length >= 2) {
        dictionary[temp[0]] = temp[1];
        //WSH.echo(dictionary[ temp[0] ]);
    }
}

// ������ ������, ������� ���������� ������������
var str = data_stream.ReadAll();

// ��������
code = "";
for(i = 0; i < str.length; ++i) {
    if(str.charCodeAt(i+1) == 10 && str.charCodeAt(i) == 13) { code += '\n'; ++i; continue; }
    
    if(dictionary[ str.charAt(i) ] == undefined) {
        WSH.echo("���������� ������������ ���� ����� �� ����� " + WScript.Arguments(1) + " � ������� ������� " + WScript.Arguments(0));
        WSH.quit(1);
    }
    code += dictionary[str.charAt(i)];
}
code_stream.write(code);
WSH.echo(code);