/*
 * Prof of concept library in Node.js & OpenERP
 */
require('hupernikao');
var xmlrpc = require('xmlrpc');

oerp_connection = function(database, host, port) {
    this.database = database;
    this.host = host;
    this.port = parseInt(port);

    this.rpc_common = xmlrpc.createClient({ host: this.host, port: this.port, path: '/xmlrpc/common'})
    this.rpc_object= xmlrpc.createClient({ host: this.host, port: this.port, path: '/xmlrpc/object'})
    console.log(getDateTime().magenta +
        ' Initializating Connection to OpenERP '.help.bold + ' using: '
        + this.host + ':'
        + String(this.port) + '/'
        + this.database);
}

oerp_connection.prototype.read = function(user_id,password,model,ids,fields) {
    fields = fields || [];
    var args = [this.database,user_id,password,model,'read',ids,fields];
    console.log(args);
    this.rpc_object.methodCall('execute',args, function (error, result) {
        console.log(result);
    });
}

oerp_connection.prototype.login = function(username,password) {
    console.log(getDateTime().magenta + " loggining '" +  this.username + "' using database '" + this.database + "'...");
    var args = [this.database, username, password];
    this.rpc_common.methodCall('login', args, function (error, result) {
        switch(result){
            case undefined:
                console.log('Error de Conexion'.error.bold);
                break;
            case false:
                console.log(getDateTime().magenta + " ERROR starting session from '".warn + username.warn + "'".warn + ", password or username incorrect" + " using database '" + this.database + "'");
                break;
            default:
                this.user_id = result;
                var obj = new oerp_connection(this.database, this.host, this.port);
                res = obj.read(this.user_id,password,'res.users',this.user_id,['name']);
                console.log(res);
                console.log(getDateTime().magenta + " Successful login from '".info + username.info.bold.inverse + "'".info + " using database '" + this.database + "'");
                break;
        }       
    });
};