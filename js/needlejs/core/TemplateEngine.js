/**
 * @author Miroslav Nikolov (@moubi)
 * @description Simple javascript based template engine.
 *  
 * @credits doT.js - http://olado.github.com/doT/
 * @credits John Resig - http://ejohn.org/
 *   
 */
NEEDLE.transplant("TemplateEngine", function() {
NEEDLE.XML && NEEDLE.extend(TemplateEngine, NEEDLE.XML);

TemplateEngine.LEFT_DELIMITER = "\\{\\?";
TemplateEngine.RIGHT_DELIMITER = "\\?\\}";

var _expressions = {
	variables : new RegExp(TemplateEngine.LEFT_DELIMITER + "\\s*([a-zA-Z0-9\\!\\+\\-\\*\\/\\_\\$\\.\\[\\]]+)\\s*" + TemplateEngine.RIGHT_DELIMITER, "g"), 
	shortIf : new RegExp(TemplateEngine.LEFT_DELIMITER + "\\s*(\\({1}.+\\){1}\\s*\\?{1}\\s*.+\\s*\\:{1}\\s*.+)\\s*" + TemplateEngine.RIGHT_DELIMITER, "g"),
	// If, else, loops, closing loops, closing if/else
	// TODO: Needs refining (not tested with } else if() {)
	left : new RegExp(TemplateEngine.LEFT_DELIMITER + "(?=(\\s*\\w+)|(\\s*\\}\\s*" + TemplateEngine.RIGHT_DELIMITER + ")|(\\s*\\}\\s*else\\s*\\{\\s*" + TemplateEngine.RIGHT_DELIMITER + "))", "g"), 
	right : new RegExp(TemplateEngine.RIGHT_DELIMITER, "g")
};
function TemplateEngine() {
	this.TemplateEngine();
}
TemplateEngine.prototype.TemplateEngine = function(dir) {
	this.XML && this.XML();
	this.dir = dir || "./templates/";
	//this.templateVars = [];
	//this.fetchedTemplates = [];
	
	return this;
};
TemplateEngine.prototype.templateVars = [];
TemplateEngine.prototype.fetchedTemplates = [];
TemplateEngine.prototype.assign = function(name, value) {
	if (typeof name === "object") {
		var i;
		for (i in name) { this.templateVars[i] = name[i]; }
	} else {
		this.templateVars[name] = value;
	}
	return this;
};
TemplateEngine.prototype.fetch = function(template, callback, async) {
	if (typeof template === "object") {
		this.fetchedTemplates[template.name] = template.value;
		_fetch.call(this, template.value, callback);
		
	} else if (template.indexOf(".xml") !== -1) {
		if (template in this.fetchedTemplates) {
			_fetch.call(this, NEEDLE.XML.serialize(this.fetchedTemplates[template]), callback);
		} else {
			this.load(this.dir + template, function() {
				this.fetchedTemplates[template] = this.doc.documentElement;
				_fetch.call(this, NEEDLE.XML.serialize(this.doc.documentElement), callback);
			}, async);
		}
	} else if (template === document) {
		// Template is an HTML document.
	}
	return this;
};

function _fetch(string, callback) {
	var result = "var output='" + 
	_trim(string).
	replace(_expressions.variables, "';output+=$1;output+='").
	replace(_expressions.shortIf, "';output+=$1;output+='").
	replace(_expressions.left, "';").
	replace(_expressions.right, "output+='") + "';";

	result = new Function("param", "with (this) {" + result + "}" + "return output;").call(this.templateVars);
	(typeof callback === "function") && callback.call(this, result);
}
function _trim(str) {
	return str.replace(new RegExp("(" + TemplateEngine.LEFT_DELIMITER + ")" + "\\s*", "g"), "$1").replace(new RegExp("\\s*" + "(" + TemplateEngine.RIGHT_DELIMITER + ")", "g"), "$1");/*.replace(/([\t|\n|\r])/g, "");*/
}

return TemplateEngine;
});