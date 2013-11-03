<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'calendar/calendar.php';


/**
 * This class creates some calendar entries
 */
class calendar_offline extends calendar
{

	/**
	 * Check if the cache-file exists
	 */
	public function run()
	{
		for ($i = 1; $i <= $this->count; $i++)
		{
			$tag = $tag + rand(1, 3);
			$event = array('Meeting', 'Doctor', 'Waste');
			$waste = array('#222266', '#664422', '#555555', '#666600');
			$title = $event[rand(0, 2)];

			$this->data[] = array(
				'pos' => $i,
				'start' => date('y-m-d', time() + $tag * 24 * 60 * 60).' '.rand(8, 14).':00:00',
				'end' => date('y-m-d', time() + $tag * 24 * 60 * 60).' '.rand(15, 20).':00:00',
				'title' => $title,
				'where' => ($title == 'Doctor' ? 'Würzburg' : ''),
				'icon' => ($title == 'Waste' ? 'icons/ws/message_garbage.png' : ''),
				'color' => ($title == 'Waste' ? $waste[rand(0, 3)] : '')
			);
		}
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new calendar_offline(array_merge($_GET, $_POST));
echo $service->json();

?>
