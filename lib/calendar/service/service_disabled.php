<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Wolfram v. Hülsen
 * @copyright   2020
 * @license     GPL [http://www.gnu.de]
 *
 * dummy calendar service to disable calendar integration into index.html
 * -----------------------------------------------------------------------------
 * @hide        calendar_url
 * @hide        calendar_username
 * @hide        calendar_password
 * @hide        calendar_google_refresh_token
 * @hide		calendar_name
 * @hide		calendar_color 
 */
require_once '../../../lib/includes.php';
require_once const_path_system . 'calendar/calendar.php';

class calendar_disabled extends calendar
{
	public function __construct(){
		parent::__construct(null);	
		
		$this->error('Calendar service', 'Calendar service is disabled. Select a web service or "offline" for a demo.<br><br>'.
		'Remove the widget from your pages if you don\'t need the service.');
	}
}
$service = new calendar_disabled(array_merge($_GET, $_POST));
echo $service->json();

?>