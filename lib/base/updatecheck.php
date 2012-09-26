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
     
    $url ="http://sourceforge.net/api/file/index/project-id/759253/mtime/desc/limit/1/rss";
    
    // get contents
    $data = file_get_contents($url);
    $xml = simplexml_load_string($data);
    
    $file = basename(str_replace('/download', '', (string)$xml->channel->item->link));
    
    $ret["local"] = config_version;
    $ret["remote"] = substr(strstr($file, '_'), 1, 3);
    $ret["update"] = false;
    
    if (str_replace('.', '', $ret["remote"]) > str_replace('.', '', $ret["local"]))
        $ret["update"] = true;
    
    echo json_encode($ret);
?>