//config variables
var server_port       = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var redis_ipaddress   = process.env.OPENSHIFT_REDIS_DB_HOST || "127.0.0.1";
var redis_port        = process.env.OPENSHIFT_REDIS_DB_PORT || 6379;
var redis_password    = process.env.OPENSHIFT_REDIS_DB_PASSWORD || "";

exports.env = {
  'port': server_port,
  'ip': server_ip_address,
  'redis_port': redis_port,
  'redis_ip': redis_ipaddress,
  'redis_password': redis_password
}