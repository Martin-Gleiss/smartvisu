<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */


require_once '../../config.php';
require_once const_path_system.'functions.php';

$ret .= "REQUEST:\r\n";
$ret .= print_r($_REQUEST, true);

$ret .= "\r\nSESSION:\r\n";
$ret .= print_r($_SESSION, true);

$ret .= "\r\nCOOKIE:\r\n";
$ret .= print_r($_COOKIE, true);

$ret .= "\r\nHEADER:\r\n";
$ret .= print_r(apache_request_headers(), true);

filewrite('temp/request_'.date('Ymd_His').'.txt', $ret);
echo $ret;

?>