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
require_once const_path_system.'phone/phone.php';


/**
 * This class reads the phonelist of an fritz!box phonesystem
 */
class phone_fritzbox extends phone
{

	/**
	 * retrieve the content
	 */
	public function run()
	{
		// 1. login
		$url = 'http://'.$this->server.'/cgi-bin/webcm';
		$par = 'getpage=../html/de/menus/menu2.html&errorpage=../html/index.html';
		$par .= '&var:lang=de&var:pagename=home&var:menu=home&uiPostVarName=&login:command/password='.$this->pass;

		$header[] = 'Content-type: application/x-www-form-urlencoded';
		$header[] = 'Accept: application/xml';
		$header[] = sprintf('Content-Length: %d', strlen($par));

		$context = stream_context_create(array('http' => array('method' => "POST", 'header' => implode("\r\n", $header), 'content' => $par)));
		$login = file_get_contents($url, false, $context);
		$this->debug($login, "login");

		if (strpos($login, 'class="errorMessage"') == 0)
		{
			// 2. download list
			$url = 'http://'.$this->server.'/cgi-bin/webcm';
			$par = 'getpage=../html/de/menus/menu2.html&errorpage=../html/de/menus/menu2.html';
			$par .= '&var:lang=de&var:pagename=foncalls&var:errorpagename=foncalls&var:menu=home&var:pagemaster=&var:activtype=pppoe';

			$data = file_get_contents($url.'?'.$par);

			// 3. parse table
			$posstart = strpos($data, '<table id="tClient">');
			$posend = strpos($data, '</table>', $posstart);
			$table = mb_convert_encoding(html_entity_decode(substr($data, $posstart, $posend - $posstart + 8)), "UTF-8", "ISO-8859-1");
			$this->debug($table, "table");

			$xml = simplexml_load_string($table);

			$i = 1;
			foreach ($xml->script as $line)
			{
				$posstart = strpos($line, 'TrCall(');
				$posend = strpos($line, '))', $posstart);
				$parts = explode(',', str_replace('"', '', substr($line, $posstart + 7, $posend - $posstart - 7)));

				$date = trim($parts[1]);
				$date = '20'.substr($date, 6, 2).'-'.substr($date, 3, 2).'-'.substr($date, 0, 2).' '.substr($date, 9, 5).':00';
				$this->data[] = array(
					'pos' => $i++,
					'dir' => (trim($parts[0]) == 3 ? -1 : (trim($parts[0]) == 1 ? 1 : 0)),
					'date' => $date,
					'number' => trim($parts[3]),
					'name' => '',
					'duration' => trim($parts[7])
				);
			}
		}
		else
			$this->error('Phone: fritz!box', "Can't read phonelist! Login faild or it is not the correct firmware version!");
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new phone_fritzbox(array_merge($_GET, $_POST));
echo $service->json();

?>
