/*
 * Prof of concept library in Node.js & OpenERP
 */
require('hupernikao');
var colors = require('colors');
var xmlrpc = require('xmlrpc');

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var Connector = function(dbname, hostname, port, user, passwd) {
    this.database = dbname;
    this.host = hostname;
    this.port = parseInt(port);
    this.user = user;
    this.password = passwd;
    this.url = 'http://'+hostname+':'+port+'/xmlrpc';
    this.common = {
        host: this.host,
        port: this.port,
        path:'/xmlrpc/common'
    };
    this.object = {
        host: this.host,
        port: this.port,
    },
    this.rpc_common = xmlrpc.createClient(this.common);
    console.log(getDateTime().magenta +
                ' Initializating Connection to OpenERP '.help.bold + ' using: '
                + this.host + ':'
                + String(this.port) + '/'
                + this.database
                );
};

Connector.prototype = {
    send: function(service, method, args){
        url_list = [this.url, "/", service];
        url = url_list.join("");
        this.object['url'] = url;
        this.rpc_object = xmlrpc.createClient(this.object);
    },
};

var Connection = function(connector, database){
    this.connector = connector;
    this.database = database;
    this.user = this.connector.user;
};

Connection.prototype = {
  login: function (username, password){
    console.log(getDateTime().magenta + " loggining '" + username + "' using database '" + this.database + "'...");
    this.connector.rpc_common.methodCall('login', [this.database, this.user, this.connector.password], function(error, uid){
        if (uid==false)
            console.log(getDateTime().magenta + " ERROR starting session from '".warn + username.warn + "'".warn + ", password or username incorrect" + " using database '" + this.database + "'");
        else{
            console.log(getDateTime().magenta + " Successful login from '".info + username.info.bold.inverse + "'".info + " using database '" + this.database + "'");
        }
        this.uid = uid;    
    return uid;
  });
  }
};

var Object = function(connection, model, context){
    this.connection = connection;
    this.model = model;
    this.context = context;
};

Object.prototype = {
    send: function(method, params){
        console.log('[X] method: '+method);
        console.logg('[X] params: '+args);
        result = this.connection.connector.rpc_object(method, [this.connector.database, this.connector.user, this.connector.password]);
    },
    search_count: function(domain, context){
        if (context == null){
            context = {}
        }
        return 
        console.log('search count called');
    },
    exists: function(oid, context){
        value = this.search_count(('id','=',oid), context);
        return value>0;
    },
};

OpenObject = function(database, host, port, user, password){
    this.connector = new Connector(database, host, port, user, password);
    this.connection = new Connection(this.connector, database);
};

OpenObject.prototype = {
    login: function(username, password){
        this.connection.login(username, password);
    },
};

if (typeof module !== 'undefined'){
    module.exports.OpenObject;
}