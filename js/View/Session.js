N.plug("Session", function() {
N.extend(Session, N.Object);

var SESSION_NAME = "com_traffic_tickets_user";
function Session(data) {
	this.Session(data);
}
Session.prototype.Session = function(data) {
	Session.set(data);
};
Session.set = function(data) {
	document.cookie = SESSION_NAME + "=" + JSON.stringify(data) + "; path=/";
};
Session.get = function() {
	return _getSession();
};
Session.remove = function() {
	Session.set(null);
};
Session.getValue = function(value) {
	var session = _getSession();
	if (session) {
		return (typeof session[value] !== "undefined") ? session[value] : null; 
	}
	return session;
};

function _getSession() {
	cookies = document.cookie.split(";"), i = cookies.length;
	while (i--) {
		if (cookies[i].indexOf(SESSION_NAME + "=") !== -1) {
			return JSON.parse(cookies[i].split("=")[1]);
		}
	}
	return false;
}

return Session;
});