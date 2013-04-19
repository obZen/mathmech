var fso = new ActiveXObject('Scripting.FileSystemObject');

var in_txt = "", code_txt = "";
if(WScript.Arguments.length >= 2) {
    // �������� ������
    in_txt = WScript.Arguments(0);
    // �������������� ������ (������)
    code_txt = WScript.Arguments(1);
} else {
    WSH.echo("Требуются имена файлов!");
    WScript.Quit(1)
}

if(!fso.FileExists(in_txt)) {
    WSH.echo("Не найден файл!");
    WScript.Quit(1);
}

fh = fso.OpenTextFile(in_txt);
result = fso.CreateTextFile(code_txt, true);

var str = fh.ReadAll();

i = 0;
n = 1;
while(i < str.length) {
	while(str.charAt(i) == str.charAt(i+n))
		++n;
	WSH.echo(str.charAt(i) + "-" + n);
  
	if(n >= 4)
	{
        var res = "";
        j = n;
		while(j >= 127) {
			res += "#" + String.fromCharCode(127) + str.charAt(i);
			j -= 127;
		}
		res += "#" + String.fromCharCode(j) + str.charAt(i);
		result.Write(res);
	}
	else if(str.charAt(i) == "#") 
        result.Write("#" + String.fromCharCode(n) + "#"); 
    else 
        result.Write(str.slice(i, i+n));
        
    i = i+n;
    n = 1;
}
fh.close();
result.close();