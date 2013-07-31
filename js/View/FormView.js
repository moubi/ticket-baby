N.plug("FormView", function() {
N.extend(FormView, N.plugins.View);
FormView.USER_DETAILS = N.DOM(".links")[0];
FormView.LOGIN_BUTTON = "loginButton";
FormView.LOGOUT_BUTTON = "logoutButton";
FormView.REGISTER_BUTTON = "registerButton";
FormView.EVENTS = { login : "login",  register : "registration", logout : "logout" };
FormView.templates = N.plugins.Templates;
FormView.engine = new N.TemplateEngine();

var FIELD_TYPES = { "text": "text", "search": "search", "email": "email", "password": "password", "url": "url" };
function FormView(form) {
	this.FormView(form);
}
FormView.prototype.FormView = function(form) {
	this.View();
	this.Session = N.plugins.Session;
	this.form = form || document.forms[0];
	this.fields = [];
	
	var session = this.Session.get();
	session && this.login(session);
};
FormView.prototype.show = function(what) {
	if (what === FormView.EVENTS.login || what === FormView.EVENTS.register) {
		var that = this;
		
		FormView.engine.fetch(FormView.templates[what], function(result) {
			that.form.style.display = "block";
			that.form.innerHTML = result;
			that.cleanFields();
			that.push(what);
		});
	}
};
FormView.prototype.cleanFields = function() {
	var elements = (this.form.elements) ? this.form.elements : N.DOM("form", this.form)[0].elements, i = elements.length;
	
	while (i--) { (elements[i].type in FIELD_TYPES) && this.fields.push(elements[i]); }
	return this.fields;
};
FormView.prototype.focus = function(field) {
	var defaultValue = N.DOM.getAttributes(field, "data-default");
	!defaultValue && N.DOM.setAttributes(field, { "data-default" : field.value });
	
	if (N.DOM.getAttributes(field, "data-default") === field.value) {
		field.value = "";
		(N.DOM.getAttributes(field, "data-type") === FIELD_TYPES.password) && (field.type = FIELD_TYPES.password);
	}
};
FormView.prototype.blur = function(field) {
	if (field.value === "") {
		field.value = N.DOM.getAttributes(field, "data-default");
		(N.DOM.getAttributes(field, "data-type") === FIELD_TYPES.password) && (field.type = FIELD_TYPES.text);
	}
};
FormView.prototype.login = function(data) {
	var that = this;
	FormView.engine.assign("data", data);
	FormView.engine.fetch(FormView.templates.welcome, function(result) {
		that.form.innerHTML = "";
		that.form.style.display = "none";
		FormView.USER_DETAILS.innerHTML = result;
		that.Session.set(data);
		that.push(FormView.EVENTS.login);
	});
};
FormView.prototype.logout = function(data) {
	this.Session.remove();
	location.reload();
};
FormView.prototype.errors = function(errors) {
	if (N.isArray(errors)) {
		var i = errors.length, j = this.fields.length;
		while (j--) {
			while (i--) {
				(this.fields[j].name in errors[i]) && (this.fields[j].style.border = "1px solid #f00");
			}
			i = errors.length;
		}
	}
};
FormView.prototype.getFields = function() {
	var i = this.fields.length, fields = {};
	while (i--) { Field.call(fields, this.fields[i]); }
	return fields;
};

function Field(field) {
	this[field.name] = field.value;
}

return FormView;
});