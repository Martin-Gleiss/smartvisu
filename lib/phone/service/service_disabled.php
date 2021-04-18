<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Wolfram v. Hülsen
 * @copyright   2020
 * @license     GPL [http://www.gnu.de]
 *
 * dummy phone service to disable phone list integration into index.html
 * -----------------------------------------------------------------------------
 * @hide        phone_server
 * @hide        phone_port
 * @hide        phone_user
 * @hide        phone_pass
 */

require_once '../../../lib/includes.php';
require_once const_path_system . 'phone/phone.php';

class phone_disabled extends phone
{
	public function __construct(){
		parent::__construct(null);	
		
		$this->error('Phone service', 'Phone service is disabled. Select a device driver or "offline" for a demo.<br><br>'
		.'Remove the widget from your pages if you don\'t need the service.');
	}
}
$service = new phone_disabled(array_merge($_GET, $_POST));
echo $service->json();

?>
