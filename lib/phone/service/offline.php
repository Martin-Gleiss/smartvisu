<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide        phone_server
 * @hide        phone_port
 * @hide        phone_user
 * @hide        phone_pass
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'phone/phone.php';


/**
 * This class creates a phonelist
 */
class phone_offline extends phone
{

	/**
	 * Create some data
	 */
	public function run()
	{
		for ($i = 9; $i > 2; $i--)
		{
			$this->data[] = array(
				'pos' => $i,
				'dir' => rand(-1, 1),
				'date' => transdate('date').' 1'.$i.':'.rand(1, 59).':00',
				'number' => '0931'.rand(1000000, 9999999),
				'name' => 'John Q. Public',
				'duration' => '00:00:'.rand(10, 50)
			);
		}

		$this->data[] = array(
			'pos' => '2',
			'dir' => '1',
			'date' => '01.10.2012 10:00:00',
			'number' => '',
			'name' => 'no number',
			'duration' => '00:00:10'
		);
		
		$this->data[] = array(
			'pos' => '1',
			'dir' => '1',
			'date' => '01.10.2012 10:00:00',
			'number' => '08003007707',
			'name' => '',
			'duration' => '00:00:10'
		);

		$this->debug($this->data, 'data');
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new phone_offline(array_merge($_GET, $_POST));
echo $service->json();

?>
