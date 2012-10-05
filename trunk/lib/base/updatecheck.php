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
              
    $ret["local"] = config_version;
    $ret["remote"] = substr(strstr($file, '_'), 1, -4);
    $ret["update"] = false;
    
    if ( (int)str_replace('.', '', $ret["remote"]) > (int)str_replace('.', '', $ret["local"]))
        $ret["update"] = true;
    
    echo json_encode($ret);
?>