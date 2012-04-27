﻿// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------// Qube Tools// Author: Brennan Chapman// Version: 1.1//// Provides methods to gather project data// and submit projects to Qube//// // Gathers all of the relevate info about a project into a JSON object// that can be used for Qube or other purposes.// ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------// --- START JSON// Using JSON to create data file that both javascript and python can read easily/*    json.js    Downloaded from: http://www.json.org/js.html    2011-02-23    Public Domain    No warranty expressed or implied. Use at your own risk.*/var JSON;if (!JSON) {    JSON = {};}(function () {    "use strict";    function f(n) {        return n < 10 ? '0' + n : n;    }    if (typeof Date.prototype.toJSON !== 'function') {        Date.prototype.toJSON = function (key) {            return isFinite(this.valueOf()) ?                this.getUTCFullYear()     + '-' +                f(this.getUTCMonth() + 1) + '-' +                f(this.getUTCDate())      + 'T' +                f(this.getUTCHours())     + ':' +                f(this.getUTCMinutes())   + ':' +                f(this.getUTCSeconds())   + 'Z' : null;        };        String.prototype.toJSON      =            Number.prototype.toJSON  =            Boolean.prototype.toJSON = function (key) {                return this.valueOf();            };    }    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,        gap,        indent,        meta = {    // table of character substitutions            '\b': '\\b',            '\t': '\\t',            '\n': '\\n',            '\f': '\\f',            '\r': '\\r',            '"' : '\\"',            '\\': '\\\\'        },        rep;    function quote(string) {        escapable.lastIndex = 0;        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {            var c = meta[a];            return typeof c === 'string' ? c :                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);        }) + '"' : '"' + string + '"';    }    function str(key, holder) {        var i,          // The loop counter.            k,          // The member key.            v,          // The member value.            length,            mind = gap,            partial,            value = holder[key];        if (value && typeof value === 'object' &&                typeof value.toJSON === 'function') {            value = value.toJSON(key);        }        if (typeof rep === 'function') {            value = rep.call(holder, key, value);        }        switch (typeof value) {        case 'string':            return quote(value);        case 'number':            return isFinite(value) ? String(value) : 'null';        case 'boolean':        case 'null':            return String(value);        case 'object':            if (!value) {                return 'null';            }            gap += indent;            partial = [];            if (Object.prototype.toString.apply(value) === '[object Array]') {                length = value.length;                for (i = 0; i < length; i += 1) {                    partial[i] = str(i, value) || 'null';                }                v = partial.length === 0 ? '[]' : gap ?                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :                    '[' + partial.join(',') + ']';                gap = mind;                return v;            }            if (rep && typeof rep === 'object') {                length = rep.length;                for (i = 0; i < length; i += 1) {                    k = rep[i];                    if (typeof k === 'string') {                        v = str(k, value);                        if (v) {                            partial.push(quote(k) + (gap ? ': ' : ':') + v);                        }                    }                }            } else {                for (k in value) {                    if (Object.prototype.hasOwnProperty.call(value, k)) {                        v = str(k, value);                        if (v) {                            partial.push(quote(k) + (gap ? ': ' : ':') + v);                        }                    }                }            }            v = partial.length === 0 ? '{}' : gap ?                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :                '{' + partial.join(',') + '}';            gap = mind;            return v;        }    }    if (typeof JSON.stringify !== 'function') {        JSON.stringify = function (value, replacer, space) {                        var i;            gap = '';            indent = '';            if (typeof space === 'number') {                for (i = 0; i < space; i += 1) {                    indent += ' ';                }            } else if (typeof space === 'string') {                indent = space;            }            rep = replacer;            if (replacer && typeof replacer !== 'function' &&                    (typeof replacer !== 'object' ||                    typeof replacer.length !== 'number')) {                throw new Error('JSON.stringify');            }            return str('', {'': value});        };    }    if (typeof JSON.parse !== 'function') {        JSON.parse = function (text, reviver) {            var j;            function walk(holder, key) {                var k, v, value = holder[key];                if (value && typeof value === 'object') {                    for (k in value) {                        if (Object.prototype.hasOwnProperty.call(value, k)) {                            v = walk(value, k);                            if (v !== undefined) {                                value[k] = v;                            } else {                                delete value[k];                            }                        }                    }                }                return reviver.call(holder, key, value);            }            text = String(text);            cx.lastIndex = 0;            if (cx.test(text)) {                text = text.replace(cx, function (a) {                    return '\\u' +                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);                });            }            if (/^[\],:{}\s]*$/                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {                j = eval('(' + text + ')');                return typeof reviver === 'function' ?                    walk({'': j}, '') : j;            }            throw new SyntaxError('JSON.parse');        };    }    if (!Object.prototype.toJSONString) {        Object.prototype.toJSONString = function (filter) {            return JSON.stringify(this, filter);        };        Object.prototype.parseJSON = function (filter) {            return JSON.parse(this, filter);        };    }}());// --- END JSONif (true) {    var Qube = (function () {        var scriptName = "Qube_Tools.jsx",            version = "1",            /**            * Prefix to use for the data files            */            dataPrefix = ".DATA.";            validVolumes = ['/Volumes/Grill/','/Volumes/Xsan/','g:/'];        return {            /**             * Returns the current version of the COB object.             *             * @see #version             * @return {String}             */            "getDataPrefix": function () {                return dataPrefix;            },            "getScriptName": function () {                return scriptName;            },            "getVersion": function () {                return version;            },            "getValidVolumes": function () {                return validVolumes;            }        };    }());    // Gather all the info about the comps    Qube.getComps = function () {        var comps, count;        comps = [];        count = 0;        for (var i=1; i<=app.project.items.length; i++) {            if (app.project.items[i] instanceof CompItem) {                var c, comp;                                c = app.project.items[i];                comp = {};                comp.name = c.name;                comp.duration = parseFloat(timeToCurrentFormat(c.duration, c.frameRate)).toFixed(0);                comp.frameRate = c.frameRate.toFixed(2);                comps[count++] = comp;            }        }        return comps;    };    // Gather all the info about the project    Qube.getProject = function () {        var project, cmd;        project = {};        project.path = app.project.file.fsName;        // Generate the project file hash code using python        // The -E option will ignore the PYTHON Path options specified by Qube.        // This avoids the import site error that occurs otherwise        cmd = "python -E -c \"import hashlib; print hashlib.md5(open('PATH', 'rb').read()).hexdigest()\"";        cmd = cmd.replace('PATH', app.project.file.fsName);        project.hash = system.callSystem(cmd).replace("\n", "");                return project;    };    // Gather all the info about the render queue    Qube.getRenderQueue = function () {        var rq, rqItems, count;        rq = app.project.renderQueue;        rqItems = [];        count = 0;        for (var i=1; i<=rq.items.length; i++) {            rqItem = {}            rqItem.index = i;            rqItem.comp = rq.items[i].comp.name;            rqItem.compDuration = parseFloat(timeToCurrentFormat(rq.items[i].comp.duration, rq.items[i].comp.frameRate)).toFixed(0);            rqItem.outFilePaths = []            rqItem.frameRate = rq.items[i].comp.frameRate.toFixed(2);            rqItem.startTime = parseFloat(timeToCurrentFormat(rq.items[i].timeSpanStart, rqItem.frameRate)).toFixed(0);            rqItem.duration = parseFloat(timeToCurrentFormat(rq.items[i].timeSpanDuration, rqItem.frameRate)).toFixed(0);            rqItem.stopTime = parseFloat(parseInt(rqItem.startTime) + parseInt(rqItem.duration));            rqItem.status = rq.items[i].status;            rqItem.render = rq.items[i].render;                        for (var o=0; o<rq.items[i].outputModules.length; o++) {                rqItem.outFilePaths[o] = rq.items[i].outputModules[o+1].file.fsName;            }            rqItems[count++] = rqItem;        }        return rqItems;    };    // Main Function    Qube.makeDataFile = function () {                var data, JSONdata;                // Switch the timecode type to frames        currTimeFormat = app.project.timeDisplayType;        app.project.timeDisplayType = TimeDisplayType.FRAMES;        data = {};        // Gather the data into an object        data.project = Qube.getProject();        data.comps = Qube.getComps();        data.rqItems = Qube.getRenderQueue();        JSONdata = JSON.stringify(data);        //$.writeln(JSONdata);        Qube.saveDataFile(JSONdata);                // Switch the timecode type back to original format        app.project.timeDisplayType = currTimeFormat;                return data;    };    Qube.saveDataFile = function(data) {        var folder, path, dataFile        folder = new Folder(app.project.file.path);        path = folder.fsName + "/" + Qube.getDataPrefix() + app.project.file.name;        //$.writeln("Data File Path: " + path);        dataFile = new File(path);        dataFile.open('w');        dataFile.write(data);        dataFile.close();    };    Qube.getQubeGUIPath = function () {        var qubeguiPath, qubeguiFile;        qubeguiPath = "";        // Get from preferences        if (app.settings.haveSetting("Qube", "QubeGUI_path")) {            qubeguiPath = app.settings.getSetting("Qube", "QubeGUI_path");        }         // if path invalid, then prompt for path        qubeguiFile = new File(qubeguiPath);        if (!qubeguiFile.exists) {            qubeguiPath = Qube.setQubeGUIPath()        }        // writeLn("QubeGUI path: "+qubeguiPath);        return qubeguiPath;    };    // See same function in Qube_SetPath.jsx    Qube.setQubeGUIPath = function () {        var qubeguiPath, qubeguiPathObj;        qubeguiPath = "";        // if not have QubeGUI path, then open dialog to browse to it        if (system.osName == "MacOS") { // note: using a prompt since the MacOS filebrowser cannot seem to select .app files            qubeguiPath = prompt("Enter the path to the QubeGUI", "/Applications/pfx/qube/qube.app");            // (For OSX) if selected app ends with .app, then append the part internal to the app            if (qubeguiPath.indexOf('.app') == qubeguiPath.length - 4) { // if .app at end                qubeguiPath += '/Contents/MacOS/qube';            }        }        else {            qubeguiPathObj = File.openDialog("Enter the path to the QubeGUI", "");            if (qubeguiPathObj != null) {                qubeguiPath = qubeguiPathObj.fsName;            }        }        if (qubeguiPath != "") {            alert("Storing 'QubeGUI_path' as '"+qubeguiPath+"'");            app.settings.saveSetting("Qube", "QubeGUI_path", qubeguiPath);        }        return qubeguiPath;    };    // Check for potential conflicts    Qube.checkProjectForErrors = function() {        var errors, warnings, rq, queued;        errors = [];        warnings = [];        rq = app.project.renderQueue;        queued = 0;        if (app.project.file == null) {            errors[errors.length] = "Please Save Project First.";        };        // Make sure there are items in the render queue        if (app.project.renderQueue.numItems < 1) {            errors[errors.length] = "No items to render in the render queue.";        };        // Make sure the project file is located on a valid volume        if (Qube.checkPathValid(app.project.file.fsName) == "") {            errors[errors.length] = "Project File not on a valid render volume";        };        // Check project items to make sure they are located on a valid volume        invalidItems = Qube.checkProjectItems();        // $.writeln(invalidItems);        if (invalidItems.length > 0) {            errors[errors.length] = "Move these items to a valid render volume:";            for (var i=0; i<invalidItems.length; i++) {                errors[errors.length] = "  " + invalidItems[i];            };        };        for (var r=1; r<=app.project.renderQueue.items.length; r++) {            var frameRate, startTime, duration, stopTime, compDuration,invalidItems;            // Gather data to use w            frameRate = rq.items[r].comp.frameRate.toFixed(2);            startTime = parseFloat(timeToCurrentFormat(rq.items[r].timeSpanStart, frameRate)).toFixed(0);            duration = parseFloat(timeToCurrentFormat(rq.items[r].timeSpanDuration, frameRate)).toFixed(0);            stopTime = parseFloat(parseInt(startTime) + parseInt(duration));            compDuration = parseFloat(timeToCurrentFormat(rq.items[r].comp.duration, rq.items[r].comp.frameRate)).toFixed(0);            status = rq.items[r].status;                        //$.writeln("status: " + status);            if ( status == RQItemStatus.QUEUED ) {                queued++;                // Check if rendering the work area or the full comp                if (startTime != 0 || stopTime < compDuration) {                    warnings[warnings.length] = "RQ# " + r + " only renderinga work area (" + startTime + "-" + stopTime + ")";                };            };        };        //$.writeln("Queued: " + queued);        if (queued == 0) {            errors[errors.length] = "No Items queued to render";        }        if (errors.length > 0) {            alert("Qube Submit Errors\n" + errors.join("\n"), "Errors", true);            return false;        } ;        if (warnings.length > 0) {            if (confirm("Qube Submit Warnings\n" + warnings.join("\n"), false, "Warnings") == false) {                return false;            }        } ;        return true;    }    // Send the After Effects Project to Qube    Qube.submitToQube = function() {        app.project.save();        var go, currTimeFormat, qubeguiPath, rq, rqi;        // Switch the timecode type to frames        currTimeFormat = app.project.timeDisplayType;        app.project.timeDisplayType = TimeDisplayType.FRAMES;           go = Qube.checkProjectForErrors();                    if (go == true) {            Qube.makeDataFile();                        qubeguiPath = Qube.getQubeGUIPath();            args = " --submitDict \"{"+                                "'prototype':'Submit After Effects v2', "+                                "'name':'" + app.project.file.fsName + "',"+                                "'package':{"+                                    "'simpleCmdType':'Submit After Effects v2',"+                                    "'setProjectPath':'"+app.project.file.fsName+"',"+                                "}}\"";            cmd = "";            if (system.osName == "MacOS") {                cmd = qubeguiPath + args + " >& /dev/null &";            }            else {                cmd = "\"" + qubeguiPath + "\"" + args;  // NOTE: using "start" does not work here            }            writeLn(cmd);            //$.writeln(cmd);            cmdOutput = system.callSystem(cmd);            writeLn(cmdOutput);        } else {            clearOutput();            writeLn("Submission Cancelled.")        }                    // Switch the timecode type back to original format        app.project.timeDisplayType = currTimeFormat;    }    Qube.checkPathValid = function(path) {        var valid = false;        for (var v=0; v<Qube.getValidVolumes().length; v++) {            if (path.match(Qube.getValidVolumes()[v]) != null) {                valid = true;            }        }        //$.writeln(valid + ' ' + path);        return valid;    } ;    Qube.checkProjectItems = function() {        var invalidItems;        // Check every project item to make sure the source path is under one of the networkVolumes        invalidItems = [];        for (var i=1; i<=app.project.items.length; i++) {            // Check the mainSource            if (app.project.items[i].mainSource instanceof FileSource) {                var path;                path = app.project.items[i].mainSource.file.fsName;                // Make sure the item is used                if (app.project.items[i].usedIn != "") {                    if (!Qube.checkPathValid(path)) {                        invalidItems[invalidItems.length] = path;                    }                }            }            // Check the proxySource            if (app.project.items[i].proxySource instanceof FileSource) {                var path;                path = app.project.items[i].proxySource.file.fsName;                if (app.project.items[i].usedIn != "") {                    if (!Qube.checkPathValid(path)) {                        invalidItems[invalidItems.length] = path;                    }                }            }        }        return invalidItems;    } ;};