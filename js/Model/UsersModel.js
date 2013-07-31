N.plug("UsersModel", function() {
N.extend(UsersModel, N.plugins.Model);

UsersModel.TABLE = "users";
UsersModel.FIELDS = { id : "required", email : "required", password : "required", first_name : "required", last_name : "required" };
function UsersModel() {
	this.UsersModel();
}
UsersModel.prototype.UsersModel = function() {
	this.Model();
};
UsersModel.prototype.login = function(data) {
	if (typeof data === "object") {
		if (this.getErrors(data).length === 0) {
			if (this.checkLogin(data)) {
				return true;
			} else {
				this.getErrors({ email : "", password : "" });
			}
		}
	}
	return false;
};
UsersModel.prototype.register = function(data) {
	return this.insert(data);
};
UsersModel.prototype.checkLogin = function(data) {
	this.select(function(row) { return row.email === data.email && row.password === data.password; });
	return this.data.length > 0;
};

return UsersModel;
});