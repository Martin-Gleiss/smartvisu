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
    require_once 'config.php';
    
    // init parameters
    $request = array_merge($_GET, $_POST);
    
    // establish connection
    $driver = 'driver_'.config_driver;
    include('driver/'.$driver.'.php');
    $knx = new $driver(config_driver_address, config_driver_port);
    
    // open
    echo $knx->open();
	
	if (isset($request['gad']))
    {
        // write to bus
        if (isset($request['val']))
        {
            $knx->write($request['gad'], $request['val']);
            $response = $request['val'];
        }
        
        // read from bus
        else
        {
            $response = $knx->read($request['gad']);
        }
    }
   
    // close
    $knx->close();

    echo $response;
?>