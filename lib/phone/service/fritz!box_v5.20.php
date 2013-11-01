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
 * This class reads the phonelist of an fritz!box phonesystem 7390 with firmware > 5.20 and < 5.50
 */
class phone_fritzbox_v5_20 extends phone
{
	private $login_parm;
	private $csv;

	/**
	 *
	 */
	private function connect()
	{
		$content = 'login:command/response=';
		$content .= $this->login_parm->Challenge.'-'.md5(mb_convert_encoding($this->login_parm->Challenge.'-'.$this->pass, 'UCS-2LE', 'UTF-8'));
		$content .= '&getpage=../html/login_sid.xml';
		$header[] = 'Content-type: application/x-www-form-urlencoded';
		$header[] = 'Accept: application/xml';
		$header[] = sprintf('Content-Length: %d', strlen($content));
		$context = array(
			'http' => array(
				'method' => 'POST',
				'header' => implode("\r\n", $header),
				'content' => $content
			)
		);

		$response = file_get_contents('http://'.$this->server.'/cgi-bin/webcm', false, stream_context_create($context));
		$this->login_parm = '';
		$this->login_parm = simplexml_load_string($response);

		if ($this->login_parm->SID == '0000000000000000' || strlen($this->login_parm->SID) != '16')
			$this->error('Phone: fritz!box', 'Login failed!');
	}

	/**
	 *
	 */
	private function my_str_getcsv($input, $delimiter = ';', $enclosure = '"', $escape = null, $eol = null)
	{
		$temp = fopen('php://memory', 'rw');
		fwrite($temp, $input);
		fseek($temp, 0);
		$r = array();
		while (($data = fgetcsv($temp, 4096, $delimiter, $enclosure)) !== false)
		{
			$r[] = $data;
		}

		fclose($temp);

		return $r;
	}

	/**
	 *
	 */
	private function handlecsv()
	{
		/*
		[0] => Typ
		[1] => Datum
		[2] => Name
		[3] => Rufnummer
		[4] => Nebenstelle
		[5] => Eigene Rufnummer
		[6] => Dauer
		*/

		// cut off the first three header lines
		$this->csv = preg_replace("/^(.*\n){3}/", "", $this->csv);

		// convert into array
		$this->csv = $this->my_str_getcsv($this->csv);

		$this->debug($this->csv, 'csv');

		$i = 1;
		foreach ($this->csv as $parts)
		{
			$date = trim($parts[1]);
			$date = '20'.substr($date, 6, 2).'-'.substr($date, 3, 2).'-'.substr($date, 0, 2).' '.substr($date, 9, 5).':00';

			$this->data[] = array(
				'pos' => $i++,
				'dir' => (trim($parts[0]) == 1 ? -1 : (trim($parts[0]) == 2 ? 1 : 0)),
				'date' => $date,
				'number' => $parts[3],
				'name' => $parts[2],
				'called' => $parts[5],
				'duration' => $parts[6]
			);
		}
	}

	/**
	 *
	 */
	public function run()
	{
		// try to get sid and challenge
		$this->login_parm = simplexml_load_string(file_get_contents('http://'.$this->server.'/cgi-bin/webcm?getpage=../html/login_sid.xml'));

		// if sid not set do login
		if ($this->login_parm->SID == '0000000000000000' || strlen($this->login_parm->SID) != '16')
			$this->connect();

		// get csv
		$this->csv = file_get_contents('http://'.$this->server.'/cgi-bin/webcm?getpage=../html/de/FRITZ!Box_Anrufliste.csv&sid='.$this->login_parm->SID);

		// handle csv
		if (strlen($this->csv) > 10)
			$this->handlecsv();

		// free vals	
		$this->csv = '';
		$this->login_parm = '';
	}

} // class end


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new phone_fritzbox_v5_20(array_merge($_GET, $_POST));
echo $service->json();

?>
