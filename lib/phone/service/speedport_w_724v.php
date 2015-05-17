<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Johannes Willnecker
 * @copyright   2015
 * @license     GPL [http://www.gnu.de]
 *              To get the phonelist from Telekom Speedport W724V Typ B
 *              it is necessary to login into the router.
 * -----------------------------------------------------------------------------
 */

require_once '../../../lib/includes.php';
require_once const_path_system.'phone/phone.php';


/**
 * This class reads the phonelist of a Telekom Speedport W 724V Typ B router
 */
class phone_speedport_w_724V extends phone
{
	private function getSpeedportStatus($json, $varid)
	{
		foreach ($json as $value)
		{
			if ($value->varid == $varid && $value->vartype == 'status')
			{
				return ($value->varvalue);
			}
		}

		return ('unknown');
	}

	private function getSpeedportValue($json, $varid)
	{
		foreach ($json as $value)
		{
			if ($value->varid == $varid && $value->vartype == 'value')
			{
				return ($value->varvalue);
			}
		}

		return ('unknown');
	}

	public function run()
	{
		// Get httoken from the login page. It seems to be possible to create an own httoken but we will use the one provided by the router.
		// The httoken must be used for all subsequent requests.
		$url = 'http://'.$this->server.'/html/login/';
		$context = stream_context_create(array('http' => array('method' => 'GET', 'header' => "Accept: text/html,application/xhtml+xml,application/xml, */*\r\n".
				"User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64)\r\n")));

		$data = file_get_contents($url, false, $context);
		preg_match('/var _httoken = ([0-9]*);/', $data, $httoken);
		$httoken = $httoken[1];

		// login
		$url = 'http://'.$this->server.'/data/Login.json';

		$postdata = http_build_query(array(
											 'password' => md5($this->pass),
											 'showpw' => 0,
											 'httoken' => $httoken
									 ));

		$context = stream_context_create(array('http' =>
				array(
						'method' => 'POST',
						'header' => "Accept: application/json, text/javascript, */*\r\n".
								"Content-type: application/x-www-form-urlencoded\r\n".
								"Origin: http://".$this->server."\r\n".
								"User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64)\r\n".
								"X-Requested-With: XMLHttpRequest\r\n",
						'content' => $postdata
				)
										 ));

		// ---> response
		$login = file_get_contents($url, false, $context);
		$login = json_decode($login);

		if ($this->getSpeedportStatus($login, 'login') == 'success')
		{
			// store the authentication cookie
			foreach ($http_response_header as $response)
			{
				if (substr($response, 0, 11) == 'Set-Cookie:')
				{
					$c = preg_split('/;[ ]?/', substr($response, 12));
					if (substr($c[0], -7, 7) != 'deleted')
						$cookie[] = $c[0];
				}
			}

			// Get the phone calls
			$url = 'http://'.$this->server.'/data/PhoneCalls.json?_time='.time().'&_rand='.rand(0, 999).'&_lang=DE&_tn='.$httoken;

			$ctxopts = array('http' =>
					array('method' => 'GET',
							'header' => "Accept: text/html,application/xhtml+xml,application/xml, */*\r\n".
									"Cookie: ".implode('; ', $cookie)."\r\n".
									"Referer: http://".$this->server."/html/login/index.html\r\n".
									"User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64)\r\n"
					)
			);
			$context = stream_context_create($ctxopts);

			$data = file_get_contents($url, false, $context);

			$data = json_decode($data);

			foreach ($data as $ds)
			{
				if ($ds->vartype == 'template' and $ds->varid == 'adddialedcalls')
				{
					$date = $this->getSpeedportValue($ds->varvalue, 'dialedcalls_date');
					$date = substr($date, 6, 4).'-'.substr($date, 3, 2).'-'.substr($date, 0, 2).' '.$this->getSpeedportValue($ds->varvalue, 'dialedcalls_time');
					$datearray[] = $date;
					$this->data[] = array(
							'dir' => '-1',
							'date' => $date,
							'number' => $this->getSpeedportValue($ds->varvalue, 'dialedcalls_who'),
							'duration' => $this->getSpeedportValue($ds->varvalue, 'dialedcalls_duration')
					);
				}
				if ($ds->vartype == 'template' and $ds->varid == 'addmissedcalls')
				{
					$date = $this->getSpeedportValue($ds->varvalue, 'missedcalls_date');
					$date = substr($date, 6, 4).'-'.substr($date, 3, 2).'-'.substr($date, 0, 2).' '.$this->getSpeedportValue($ds->varvalue, 'missedcalls_time');
					$datearray[] = $date;
					$this->data[] = array(
							'dir' => '0',
							'date' => $date,
							'number' => $this->getSpeedportValue($ds->varvalue, 'missedcalls_who')
					);
				}
				if ($ds->vartype == 'template' and $ds->varid == 'addtakencalls')
				{
					$date = $this->getSpeedportValue($ds->varvalue, 'takencalls_date');
					$date = substr($date, 6, 4).'-'.substr($date, 3, 2).'-'.substr($date, 0, 2).' '.$this->getSpeedportValue($ds->varvalue, 'takencalls_time');
					$datearray[] = $date;
					$this->data[] = array(
							'dir' => '1',
							'date' => $date,
							'number' => $this->getSpeedportValue($ds->varvalue, 'takencalls_who'),
							'duration' => $this->getSpeedportValue($ds->varvalue, 'takencalls_duration')
					);
				}
			}
			// sort the phone calls
			array_multisort($datearray, SORT_DESC, $this->data);
			$i = 1;
			foreach ($this->data as $key => $value)
			{
				$this->data[$key]['pos'] = $i++;
			}
		}
		else
			$this->error('Phone: Speedport', 'Login failed!');

		// logout
		$url = 'http://'.$this->server.'/data/Login.json';

		$postdata = http_build_query(array(
											 'logout' => 'byby',
											 'httoken' => $httoken
									 ));

		$context = stream_context_create(array('http' =>
				array(
						'method' => 'POST',
						'header' => "Accept: application/json, text/javascript, */*\r\n".
								"Content-type: application/x-www-form-urlencoded\r\n".
								"Origin: ".$this->server."\r\n".
								"User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64)\r\n".
								"X-Requested-With: XMLHttpRequest\r\n",
						'content' => $postdata
				)
										 ));

		// ---> response
		$logout = file_get_contents($url, false, $context);
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new phone_speedport_w_724V(array_merge($_GET, $_POST));
echo $service->json();

?>
