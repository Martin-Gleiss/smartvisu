<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012 - 2015
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide        calendar_url
 * @hide        calendar_username
 * @hide        calendar_password
 * @hide        calendar_google_refresh_token
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
		$event = array();
		if(in_array('personal', $this->calendar_names))
			$event += array_merge($event, array('Meeting', 'Doctor', 'Holidays', 'Trip'));
		if(in_array('waste', $this->calendar_names)) {
			$waste = array('green bin', 'blue bin', 'yellow bin', 'black bin');
			$event += array_merge($event, $waste);
		}

		for ($i = 1; $i <= $this->count; $i++)
		{
			$tag = $tag + rand(1, 3);
			$colors = array('#44a', '#642', '#555', '#660');
			$title = $event[rand(0, count($event)-1)];

			if(isset($waste) && in_array($title, $waste)) {
				$this->data[] = array( // single hole day event
					'pos' => $i,
					'start' => time() + $tag * 24 * 60 * 60,
					'end' => time() + $tag * 24 * 60 * 60 + 86400,
					'title' => $title,
					'where' => '',
					'icon' => 'icons/ws/message_garbage.svg',
					'color' => $colors[rand(0, count($colors)-1)],
					'calendarname' => 'waste'
				);
			}
			else if($title == 'Holidays') { // multiple hole days event
				$this->data[] = array(
					'pos' => $i,
					'start' => time() + $tag * 24 * 60 * 60,
					'end' => time() + $tag * 24 * 60 * 60 + 86400 * 5,
					'title' => $title,
					'where' => '',
					'icon' => '',
					'color' => '',
					'calendarname' => 'personal'
				);
			}
			else if($title == 'Trip') { // two day event (with time)
				$this->data[] = array(
					'pos' => $i,
					'start' => time() + $tag * 24 * 60 * 60 + rand(8, 14) * 60 * 60,
					'end' => time() + $tag * 24 * 60 * 60 + 86400 + rand(8, 14) * 60 * 60,
					'title' => $title,
					'where' => '',
					'icon' => '',
					'color' => '',
					'calendarname' => 'personal'
				);
			}
			else {
				$this->data[] = array(
					'pos' => $i,
					'start' => time() + $tag * 24 * 60 * 60 + rand(8, 14) * 60 * 60,
					'end' => time() + $tag * 24 * 60 * 60 + rand(15, 20) * 60 * 60,
					'title' => $title,
					'where' => ($title == 'Doctor' ? 'Würzburg' : ''),
					'icon' => '',
					'color' => '',
					'calendarname' => 'personal'
				);
			}
		}
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

if (realpath(__FILE__) == realpath($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'])) {
	header('Content-Type: application/json');
	$service = new calendar_offline(array_merge($_GET, $_POST));
	echo $service->json();
}
?>