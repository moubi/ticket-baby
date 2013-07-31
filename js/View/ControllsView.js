N.plug("ControllsView", function() {
N.extend(ControllsView, N.plugins.View);
ControllsView.NAV = N.DOM("nav")[0];
ControllsView.TRAPS = N.DOM("#traps")[0];
ControllsView.TRAPS_BUTTON = "trapsButton";
ControllsView.TRAPS_MARKER_CLASS = "trapsMarker";
ControllsView.SELECTED_MARKER_CLASS = "selected";
ControllsView.EVENTS = { marker_select : "marker_select", traps : "traps", controlls_hide : "controlls_hide" };

ControllsView.templates = N.plugins.Templates;
ControllsView.engine = new N.TemplateEngine();

function ControllsView(holder) {
	this.ControllsView(holder);
}
ControllsView.prototype.ControllsView = function(holder) {
	this.View();
	this.Session = N.plugins.Session;
	this.holder = holder;
	this.marker = null;
};
ControllsView.prototype.show = function(what, data) {
	if (what === ControllsView.EVENTS.traps) {
		var that = this;

		(typeof data !== "undefined") && ControllsView.engine.assign("data", data);
		ControllsView.engine.assign("logged", this.Session.getValue("id"));
		ControllsView.engine.fetch(ControllsView.templates[what], function(result) {
			that.holder.style.display = "block";
			that.holder.innerHTML = result;
			that.push(what);
		});
	}
};
ControllsView.prototype.hide = function(callback) {
	this.holder.innerHTML = "";
	this.push(ControllsView.EVENTS.controlls_hide);
	(typeof callback === "function") && callback.call(this);
};
ControllsView.prototype.selectMarker = function(marker, type) {
	marker.className = ControllsView.SELECTED_MARKER_CLASS;
	this.marker = N.DOM.getAttributes(marker, "data-marker-id");
	this.push(ControllsView.EVENTS.marker_select);
};

return ControllsView;
});