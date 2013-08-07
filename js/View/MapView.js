N.plug("MapView", function() {
N.extend(MapView, N.plugins.View);

MapView.EVENTS = { marker : "marker_add", fullscreen : "fullscreen", map : "map_created", agree : "agree", protest : "protest" };
MapView.POPUP = { agreement : "agreement_popup", overview : "overview_popup", history : "trap_history", details : "trap_details" };
MapView.POPUP_CLASS = "popup";
MapView.POPUP_CONTENT_CLASS = "content";
MapView.POPUP_SELECTED_TAB_CLASS = "selected";
MapView.templates = N.plugins.Templates;
MapView.engine = new N.TemplateEngine();

function MapView(data) {
	this.MapView(data);
}
MapView.prototype.MapView = function(data) {
	if (typeof data === "object") {
		this.View();
		this.config = data;
		this.holder = data.holder || document.body;
		this.map = null;
		this.markers = [];
		this.currentMarker = null;
		this.currentPopup = null;
		this.currentTab = null;
	}
};
MapView.prototype.set = function(data, callback) {
	if (typeof data === "object") {
		this.fullScreen();
	    this.map = new N.plugins.Map(this.holder, N.objectMerge({}, data, this.config));
	    this.push(MapView.EVENTS.map);
	    (typeof callback === "function") && callback.call(this, this.map.map);
	}
	return this;
};
MapView.prototype.fullScreen = function() {
	N.DOM.style(this.holder, { 
		width : (window.innerWidth || document.documentElement.clientWidth) + "px", 
		height : (window.innerHeight || document.documentElement.clientHeight) + "px"
	});
	this.push(MapView.EVENTS.fullscreen);
	return this;
};
MapView.prototype.marker = function(data, callback) {
	if (typeof data === "object") {
		this.markers.push(this.currentMarker = this.map.addMarker(data));
		this.push(MapView.EVENTS.marker);
		(typeof callback === "function") && callback.call(this, this.currentMarker);
	}
	return this;
};
MapView.prototype.popup = function(data, callback) {
	if (typeof data === "object") {
		var that = this;
		MapView.engine.assign("type", data.template).assign("data", data.templateVars);
		MapView.engine.fetch(MapView.templates[data.template], function(result) {
			that.currentPopup = that.map.addPopup(result, data.marker);
			(typeof callback === "function") && callback.call(that, that.currentPopup);
		});
	}
	return this;
};
MapView.prototype.removePopup = function(popup, callback) {
	this.map.removePopup(popup);
	(this.currentPopup === popup) && (this.currentPopup = null);
	return this;
};
MapView.prototype.removeMarker = function(marker, callback) {
	this.map.removeMarker(marker);
	if (this.currentMarker === marker) {
		this.currentMarker = null;
		this.currentPopup = null;
	}
	(typeof callback === "function") && callback.call(this);
	return this;
};
MapView.prototype.openPopup = function(popupOrMarker, callback) {
	if (popupOrMarker instanceof this.map.Popup) {
		this.map.openPopup(popupOrMarker);
	} else if (popupOrMarker instanceof this.map.Marker) {
		popupOrMarker.openPopup();
	}
	(typeof callback === "function") && callback.call(this, popupOrMarker);
	return this;
};
MapView.prototype.closePopup = function(popupOrMarker, callback) {
	if (popupOrMarker instanceof this.map.Popup) {
		this.map.closePopup(popupOrMarker);
	} else if (popupOrMarker instanceof this.map.Marker) {
		popupOrMarker.closePopup();
	}
	(typeof callback === "function") && callback.call(this, popupOrMarker);
	return this;
};
MapView.prototype.setCurrentPopup = function(popup) {
	(popup instanceof this.map.Popup) && (this.currentPopup = popup);
};
MapView.prototype.getCurrentMarkerId = function() {
	var markerId = N.DOM.getAttributes(N.DOM("." + MapView.POPUP_CLASS, this.currentPopup._container)[0], "data-marker");
	return markerId || false;
};
MapView.prototype.agree = function(button) {
	N.DOM.setAttributes(button, { "data-misc" : "button large gray" });
	this.push(MapView.EVENTS.agree);
};
MapView.prototype.protest = function(button) {
	N.DOM.setAttributes(button, { "data-misc" : "button large gray" });
	this.push(MapView.EVENTS.protest);
};
MapView.prototype.trapHistory = function(user, data, button) {
	var that = this;
	MapView.engine.assign("user", user).assign("data", data);
	MapView.engine.fetch(MapView.templates[MapView.POPUP.history], function(result) {
		N.DOM("." + MapView.POPUP_CONTENT_CLASS, that.currentPopup._container)[0].innerHTML = result;
		that.selectTab(button);
	});
};
MapView.prototype.trapDetails = function(user, button) {
	var that = this;
	MapView.engine.assign("user", user);
	MapView.engine.fetch(MapView.templates[MapView.POPUP.details], function(result) {
		N.DOM("." + MapView.POPUP_CONTENT_CLASS, that.currentPopup._container)[0].innerHTML = result;
		that.selectTab(button);
	});
};
MapView.prototype.selectTab = function(tab) {
	this.currentTab && (this.currentTab.className = "");
	(this.currentTab = tab).className = MapView.POPUP_SELECTED_TAB_CLASS;
};

return MapView;
});