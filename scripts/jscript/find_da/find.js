// Создает конечный автомат по строке str
function createDetermenate(str) {
	var alph = new Array();
	for(var i = 0; i < str.length; ++i) alph[str.charAt(i)] = 0;

	var del = new Array();
	for(var i = 0; i <= str.length; ++i) del[i] = new Array();
	for(var i in alph) del[0][i] = 0;

	// Create...
	for(var i = 0; i < str.length; ++i) {
		prev = del[i][str.charAt(i)];
		del[i][str.charAt(i)] = i+1;
		for(var a in alph)
            del[i+1][a] = del[prev][a];
        
	}	
	
    for(var i = 0; i < str.length; ++i) {
        var out = "";
        for(var a in alph) out += del[i][a];
        WSH.echo(out);
    }
	return del;
}

function find(str, temp) {
	var del = createDetermenate(temp);
	var j = 0;
	var result = new Array();

	for(var i = 0; i < str.length; ++i) {
		if(temp.indexOf(str.charAt(i)) < 0) j = 0;
		else j = del[j][str.charAt(i)];

		if(j == temp.length) result.push(i - temp.length + 1);
	}

	return result;
}


//var fso = new ActiveXObject('Scripting.FileSystemObject');
//var test_stream = fso.OpenTextFile(WScript.Arguments(0));
//var substring_stream = fso.OpenTextFile(WScript.Arguments(1));

//var str = test_stream.readAll();
//var temp = substring_stream.readAll();

createDetermenate("ananas");
//WSH.echo(str);
//WSH.echo(temp);
/*var res = find(str, temp);
if(res.length == 0) WSH.echo("Нет совпадений");
else {
	for(var i = 0; i < res.length; ++i)
		WSH.echo("#" + res[i]);
}*/
