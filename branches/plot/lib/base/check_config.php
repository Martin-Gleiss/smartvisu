<?php
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
    
    if (is_writeable(const_path.'config.php')) 
    {
        $ret = array('icon' => 'icons/gn/message_ok.png', 'text' => "'config.php' is writeable");
    }
    else
    {
        header("HTTP/1.0 600 smartVISU Config Error");
        $ret = array('icon' => 'icons/or/message_attention.png', 'text' => "'config.php' is not writeable!");
    }
    
    echo json_encode($ret);
?>