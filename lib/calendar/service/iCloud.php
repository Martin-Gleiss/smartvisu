<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Serge Wagener (Foxi352), Stefan Widmer
 * @copyright   2014 - 2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 * @hide        calendar_url
 * @hide        calendar_google_refresh_token
 */

require_once './CalDav.php';

/**
 * This class reads an iCloud calendar by using generic CalDav service with hardcodd base URL
 */
class calendar_icloud extends calendar_caldav
{
	/**
	 * set iCloud url
	 */
	public function init($request)
	{
		parent::init($request);
		$this->url = 'https://caldav.icloud.com/';
	}
}

// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------
if (realpath(__FILE__) == realpath($_SERVER['DOCUMENT_ROOT'].$_SERVER['SCRIPT_NAME'])) {
	header('Content-Type: application/json');
	$service = new calendar_icloud(array_merge($_GET, $_POST));
	echo $service->json();
}
?>
