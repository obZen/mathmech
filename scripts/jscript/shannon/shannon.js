p// log_b(a) = ln(a)/ln(b)
function logb(number, base) {
    return Math.log(number)/Math.log(base);
}

var fso = new ActiveXObject('Scripting.FileSystemObject');

if(WScript.Arguments.Length < 1) {
    WSH.echo("Òðåáóåòñÿ ââîä èìåí ôàéëîâ!");
    WScript.Quit(1);
}

var in_txt = WScript.Arguments(0);

if(!fso.FileExists(in_txt)) {
    WSH.echo("Íå íàéäåí " + in_txt);
    WScript.Quit(1);
}

var in_file = fso.OpenTextFile(in_txt);

var str = in_file.ReadAll();
var alp = new Array();

// Ïîäñ÷åò ÷àñòîòû âõîæäåíèÿ ñèìâîëîâ â ñòðîêó
if(str.length == 0) {
    WSH.echo("Ð¢Ñ€ÐµÐ±ÑƒÐµÑ‚ÑÑ ÑÑ‚Ñ€Ð¾ÐºÐ° Ð´Ð»Ñ Ð²Ñ‹Ñ‡Ð¸ÑÐ»ÐµÐ½Ð¸Ñ ÑÐ½Ñ‚Ñ€Ð¾Ð¿Ð¸Ð¸");
    WScript.Quit(1);
}

if(str.length == 1) {
    WSH.echo("Ð­Ð½Ñ‚Ñ€Ð¾Ð¿Ð¸Ñ ÐµÐ´ÐµÐ½Ð¸Ñ‡Ð½Ð¾Ð¹ ÑÑ‚Ñ€Ð¾ÐºÐ¸ Ñ€Ð°Ð²Ð½Ð° 0");
    WScript.Quit(0);
}
// Ð¡Ð¾ÑÑ‚Ð°Ð²Ð»ÐµÐ½Ð¸Ðµ Ð°Ð»Ñ„Ð°Ð²Ð¸Ñ‚Ð° Ð¸ Ð¿Ð¾Ð´ÑÑ‡ÐµÑ‚ Ñ‡Ð°ÑÑ‚Ð¾Ñ‚Ñ‹ Ð²Ñ…Ð¾Ð¶Ð´ÐµÐ½Ð¸Ñ ÐºÐ°Ð¶Ð´Ð¾Ð³Ð¾ ÑÐ¸Ð¼Ð²Ð¾Ð»Ð° Ð¸Ð· ÑÑ‚Ð¾Ð³Ð¾ Ð°Ð»Ñ„Ð°Ð²Ð¸Ñ‚Ð°
for(i = 0; i < str.length; ++i) {
    alp[str.charAt(i)] = 0;
}
for(i = 0; i < str.length; ++i) {
    alp[str.charAt(i)]++;
}


var n = 0; for(key in alp)  n++;
// Âû÷èñëåíèå ýíòðîïèè Øåííîíà
var shannon = 0;
for(key in alp) {
    var c = alp[key]/str.length;
    WSH.echo(key + " " + alp[key] + "/" + str.length + "=" + c);
    shannon += c * logb(c, n);
}
shannon = (-1)*shannon;
WSH.echo("Ýíòðîïèÿ Øåííîíà: " + shannon);
