N.plug("Controller", function() {
N.extend(Controller, N.plugins.Subscriber);

var _models = {}, _views = {};
function Controller(models, views) {
	this.Controller(models, views);
}
Controller.prototype.Controller = function(models, views) {
	this.Subscriber();
	_models = models;
	_views = views;
};
Controller.prototype.init = function() {
	var that = this;
	this.addDOMListener(window, "resize", this.resize);
	this.addDOMListener(window, "load", function() {
		that.load(function(map) {
			that.addDOMListener(_views.FormView.constructor.USER_DETAILS, "click", that.link); 	// Login/Register
			that.addDOMListener(_views.FormView.form, "focus", that.focus, true); 				// Field focus
			that.addDOMListener(_views.FormView.form, "blur", that.blur, true); 				// Field blur
			that.addDOMListener(_views.FormView.form, "click", that.submit); 					// Submit Login/Register form
			that.addDOMListener(_views.ControllsView.constructor.NAV, "click", that.nav); 		// Buttons
			that.addDOMListener(_views.ControllsView.constructor.TRAPS, "click", that.traps); 	// Select traps
			that.addDOMListener(document, "click", that.confirmTrap); 							// Confirm trap
			
			map.on("click", that.addMarker);
			map.on("zoomend resize dragend", that.loadMarkers);
		});
	});
};

Controller.prototype.load = function(callback) {
	_views.MapView.set(_models.MapModel.select("*")[0], callback);
	this.loadMarkers();
};
Controller.prototype.loadMarkers = function() {
	Controller.prototype.unloadMarkers();
	var markers = _models.UserMarkersModel.select(function(row) { return _views.MapView.map.isVisible(row.latlng); }), i = markers.length;
	while (i--) {
		_views.MapView.marker(N.objectMerge(_models.MarkerModel.select(function(row) { return row.id === markers[i].mid; })[0], { latlng : markers[i].latlng, draggable : false }), function(marker) {
			this.popup({ on : marker, content : this.constructor.POPUP.overview }, function(popup) {
				this.closePopup(popup);
			});
		});
	}
};
Controller.prototype.unloadMarkers = function() {
	var i = _views.MapView.markers.length;
	while (i--) {
		_views.MapView.removeMarker(_views.MapView.markers[i]);
		_views.MapView.markers.splice(i, 1);
	}
};
Controller.prototype.resize = function() {
	_views.MapView.fullScreen();
};
Controller.prototype.link = function(e) {
	var target = N.Events.getTarget(e);
	switch (target.id) {
		case _views.FormView.constructor.REGISTER_BUTTON : { _views.FormView.show(_views.FormView.constructor.EVENTS.register); break; }
		case _views.FormView.constructor.LOGIN_BUTTON : { _views.FormView.show(_views.FormView.constructor.EVENTS.login); break; }
		case _views.FormView.constructor.LOGOUT_BUTTON : { _views.FormView.logout(); break; }
	}
};
Controller.prototype.nav = function(e) {
	var target = N.Events.getTarget(e);
	if (target.id === _views.ControllsView.constructor.TRAPS_BUTTON) {
		_views.ControllsView.show(_views.ControllsView.constructor.EVENTS.traps, _models.MarkerModel.select("*"));	
	}
};
Controller.prototype.traps = function(e) {
	var target = N.Events.getTarget(e);
	if (target.className === _views.ControllsView.constructor.TRAPS_MARKER_CLASS) {
		if (_views.FormView.Session.get()) {
			_views.ControllsView.selectMarker(target.parentNode, N.DOM.getAttributes(target, "data-type"));
		} else {
			_views.ControllsView.hide(function() {
				_views.FormView.show(_views.FormView.constructor.EVENTS.login);
			});
		}
	}
};
Controller.prototype.focus = function(e) {
	var target = N.Events.getTarget(e);
	(target.tagName === "INPUT" || target.tagName === "TEXTAREA") && _views.FormView.focus(target);
};
Controller.prototype.blur = function(e) {
	var target = N.Events.getTarget(e);
	(target.tagName === "INPUT" || target.tagName === "TEXTAREA") && _views.FormView.blur(target);
};
Controller.prototype.submit = function(e) {
	N.Events.preventDefault(e);
	var target = N.Events.getTarget(e);
	if (target.type === "submit") {
		if (N.DOM.getAttributes(target.parentNode, "data-type") === _views.FormView.constructor.EVENTS.login) {
			if (_models.UsersModel.login(_views.FormView.getFields())) {
				_views.FormView.login(_models.UsersModel.data[0]);
			} else {
				_views.FormView.errors(_models.UsersModel.errors);
			}
		} else if (N.DOM.getAttributes(target.parentNode, "data-type") === _views.FormView.constructor.EVENTS.register) {
			if (_models.UsersModel.register(_views.FormView.getFields())) {
				_views.FormView.login(_models.UsersModel.lastRecord());
			} else {
				_views.FormView.errors(_models.UsersModel.errors);
			}
		}
	}
};
Controller.prototype.addMarker = function(e) {
	if (_views.ControllsView.marker !== null && _views.FormView.Session.get()) {
		_views.MapView.marker(N.objectMerge(_models.MarkerModel.select(function(row) { return row.id == _views.ControllsView.marker; })[0], { latlng : e.latlng }), function(marker) {
			this.popup({ on : marker, content : this.constructor.POPUP.agreement });
		});
	}
};
Controller.prototype.dragendMarker = function(e) {
	e.target._popup && _views.MapView.openPopup(e.target._popup);
};
Controller.prototype.confirmTrap = function(e) {
	var target = N.Events.getTarget(e), attr;
	if (target.parentNode.className.indexOf(_views.MapView.constructor.POPUP_CLASS) !== -1) {
		if ((attr = N.DOM.getAttributes(target, "data-value")) === "yes") {
			_models.UserMarkersModel.insert({
				uid : _views.ControllsView.Session.getValue("id"), 
				mid : _views.ControllsView.marker, 
				date : new Date().toDateString(), 
				latlng : [_views.MapView.currentMarker._latlng.lat, _views.MapView.currentMarker._latlng.lng], 
				status : _models.UserMarkersModel.constructor.STATUS.pending
			});
			_views.MapView.removePopup(_views.MapView.currentPopup).popup({ on : _views.MapView.currentMarker, content : _views.MapView.constructor.POPUP.overview }, function(popup) {
				this.closePopup(popup);
			});
		} else if (attr === "no") {
			_views.MapView.removeMarker(_views.MapView.currentMarker);
		}
	}
};

return Controller;
});