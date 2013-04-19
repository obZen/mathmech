// ������������ ������ pstr �� ����� �������� � �������,
// ���� ������������� ������, �� ������������ ���� �������������� ���� ������,
// ����� ���������� �������� undefined
function search(dict, pstr) {
    for(key in dict) {
        if(dict[key] == pstr) return key;
    }
    return undefined;
}

if(WScript.Arguments.length < 3) {
    WSH.echo("��������� ��� ����� ��� �������, ��� ������ ��� ������� � �������� ������");
    WSH.echo("�Script code.js <dictionary> <input_code> <output_decode>");
    WSH.quit(1);
}

var fso = new ActiveXObject('Scripting.FileSystemObject');

if(!fso.FileExists(WScript.Arguments(0))) {
    WSH.echo("�� ������ ���� �� ��������: " + WScript.Arguments(0));
    WSH.quit(1);
}

if(!fso.FileExists(WScript.Arguments(1))) {
    WSH.echo("�� ������ ���� � ������������� �������: " + WScript.Arguments(1));
    WSH.quit(1);
}

var dictionary_stream = fso.OpenTextFile(WScript.Arguments(0));
var code_stream = fso.OpenTextFile(WScript.Arguments(1));
var decode_stream = fso.CreateTextFile(WScript.Arguments(2));

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
// ��������� ������ ��� �����������
var str = code_stream.ReadAll();

// ���������� ������ str
var decode = "";
for(i = 0; i < str.length; ++i) {
    if(str.charAt(i) == '\n') { decode += '\n'; continue; }
    
    var cur = str.charAt(i);
    while(true) {
        if(i >= str.length) {
            WSH.echo("���������� ������������ ���� ����� �� ����� " + WScript.Arguments(1) + " � ������� ������� �� ����� " + WScript.Arguments(0));
            WSH.quit(1);
        }
        
        dt = search(dictionary, cur);
        if(dt == undefined) {
            cur += str.charAt(i+1);
            ++i;
        } else {
            decode += dt;
            break;
        }
    }
}

decode_stream.write(decode);
WSH.echo(decode);