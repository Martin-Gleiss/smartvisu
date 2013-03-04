<?
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL <http://www.gnu.de>
 * ----------------------------------------------------------------------------- 
 */

    // get config-variables 
    require_once '../../config.php';
    
    // init parameters
    $request = array_merge($_GET, $_POST);
     
    $url ="http://code.google.com/feeds/p/smartvisu/downloads/basic";
    
    // get contents
    $data = file_get_contents($url);
    $xml = simplexml_load_string($data);
    
    $file = basename((string)$xml->entry->id);
    
    $ret["local"] = (strlen(config_version) > 3 ? config_version : str_replace('.', '.0', config_version));
    
    $remote = substr(strstr($file, '_'), 1, -4);
    $ret["remote"] = (strlen($remote) > 3 ? $remote : str_replace('.', '.0', $remote));
    
    $ret["update"] = ( (float)$ret["remote"] > (float)$ret["local"] );
    
    echo json_encode($ret);
?>