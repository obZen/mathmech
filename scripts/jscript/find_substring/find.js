function simpleHash(str) {
    var v = 0;
    for(var i = 0; i < str.length; ++i)
        v += str.charCodeAt(i);
    
    return v;
}

function squareHash(str) {
    var v = 0;
    for(var i = 0; i < str.length; ++i) v += (str.charCodeAt(i) * str.charCodeAt(i));
    
    return v;
}

function degreeHash(str) {
    var m = str.length;
    var v = 0;
    for(var i = 0; i < str.length; ++i, --m) v += str.charCodeAt(i)*Math.pow(2,m);
    
    return v;
}

function brutal_find(str, template) {
    if(str.length < template.length) return new Result();
    
    var res = new Result();
    for(var i = 0; i < str.length - template.length + 1; ++i) {
        var flag = 0;
        for(var j = 0; j < template.length; ++j) {
            if(template.charAt(j) == str.charAt(i+j)) ++flag;
        }
        
        if(flag == template.length) res.Add(i, 0);
    }
    
    return res;
}

function Result(pos_find, collision) {
    var pos = new Array();
    var collision = new Array();
    
    if(pos_find != undefined && collision != undefined) {
        this.Add(pos_find, collision);
    }
    
    this.Add = function(pf, c) {
        pos.push(pf);
        collision.push(c);
    }
    
    this.toString = function() {
        if(pos.length == 0) return "No matches";
        else {
            var res = "";
            for(var i = 0; i < pos.length; ++i) res += "Position: " + pos[i] +"; Collision: " + collision[i] + "\n";
            return res;
        }
    }
}

function hash_find(str, template, fhash) {
    if(str.length < template.length) return new Result(-1, 0);
    
    var template_hash = fhash(template);
    var collision = 0;
    
    var res = new Result();
    var cur_substring;
    var cur_hash = -1;
    for(var i = 0; i < str.length - template.length + 1; ++i) {
        cur_substring = str.slice(i, i+template.length);
        if(cur_hash < 0) 
            cur_hash = fhash(cur_substring); 
        else
            cur_hash = cur_hash - fhash(str.charAt(i-1)) + fhash(str.charAt(i + cur_substring.length - 1));
        
        if(cur_hash == template_hash) {
            if(cur_substring == template) res.Add(i, collision);
            else ++collision;
        }
    }
    
    return res;
}

function find_degreeHash(str, template) {
    if(str.length < template.length) return new Result(-1, 0);
    
    var template_hash = degreeHash(template);
    var collision = 0;
    
    var res = new Result();
    var cur_substring;
    var cur_hash = -1;
    for(var i = 0; i < str.length - template.length + 1; ++i) {
        cur_substring = str.slice(i, i+template.length);
        if(cur_hash < 0)
            cur_hash = degreeHash(cur_substring);
        else
            cur_hash = (cur_hash - str.charCodeAt(i-1)*Math.pow(2, template.length)) + str.charCodeAt(i + cur_substring.length-1);
        
        if(cur_hash == template_hash) {
            if(cur_substring == template) res.Add(i, collision);
            else ++collision;
        }
    }
    
    return res;
}

function getD(t1, t2) {
    var r = new Date(t1 - t2);
    return ( (r.getSeconds()) + ":" + (r.getMilliseconds()) );
}

var fso = new ActiveXObject('Scripting.FileSystemObject');
var test_stream = fso.OpenTextFile(WScript.Arguments(0));
var substring_stream = fso.OpenTextFile(WScript.Arguments(1));

var str = test_stream.readAll();
var temp = substring_stream.readAll();

var start = new Date();
WSH.echo("HASH_FIND (simpleHash)");
WSH.echo(hash_find(str, temp, simpleHash).toString());
var hfind_smp_time = new Date();
WSH.echo("TIME = " + getD(hfind_smp_time, start));

WSH.echo("HASH_FIND (squareHash)");
WSH.echo(hash_find(str, temp, squareHash).toString());
var hfind_sq_time = new Date();
WSH.echo("TIME = " + getD(hfind_sq_time, hfind_smp_time));

WSH.echo("HASH_FIND (degreeHash)");
WSH.echo(find_degreeHash(str, temp).toString());
var hfind_dgr_time = new Date();
WSH.echo("TIME = " + getD(hfind_dgr_time, hfind_sq_time));

WSH.echo("BRUTAL FIND");
WSH.echo(brutal_find(str, temp).toString());
var hfind_brutal_time = new Date();
WSH.echo("TIME = " + getD(hfind_brutal_time, hfind_dgr_time));

// pol-neba@list.ru
