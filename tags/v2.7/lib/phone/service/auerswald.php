<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 *              To get the phonelist from Auerswald VoiP 5010 or VoiP 5020 or
 *              COMmander Basic.2 it is necessary to login into the telephone 
 * 			    system. If you will use the 'admin' account, you will get
 * 				all calls. If you will use a sub-admin, you will get only those.
 *				After logged in successfully the cookie must be stored and used
 *				for all further calls.
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'phone/phone.php';


/**
 * This class reads the phonelist of an auerswald phonesystem
 */
class phone_auerswald extends phone
{

	/**
	 * Check if the cache-file exists
	 */
	public function run()
	{
		// 1. login
		$url = 'http://'.$this->server.'/login_json?LOGIN_NAME='.$this->user.'&LOGIN_PASS='.$this->pass.'&LOGIN_NOW=';
		$context = stream_context_create(array('http' => array('method' => 'POST')));

		// ---> response
		$login = json_decode(file_get_contents($url, false, $context));
		$this->debug($login, 'login');

		if ((int)$login->login > 0)
		{
			/*
			---> response-header
			[0] => HTTP/1.1 200 OK
			[1] => Server: GoAhead-Webs
			[2] => Expires: 0
			[3] => Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0
			[4] => Pragma: no-cache
			[5] => Content-Type: text/html; charset=iso-8859-1;
			[6] => Set-Cookie: AUERSessionID=JWHXBVEKTGXVKOK
			[7] => Set-Cookie: AUERWEB_COOKIE=admin
			*/
			foreach ($http_response_header as $response)
			{
				if (substr($response, 0, 11) == 'Set-Cookie:')
					$cookie[] = substr($response, 12);
			}

			// 2. data
			$url = 'http://'.$this->server.'/page_listgespr_state';
			$context = stream_context_create(array('http' => array('method' => 'GET', 'header' => 'Cookie: '.implode('; ', $cookie))));

			$data = json_decode(mb_convert_encoding(file_get_contents($url, false, $context), 'UTF-8', 'ISO-8859-1'));
			$this->debug($data, 'data');

			foreach ($data as $ds)
			{
				$dir = "";
				if (trim($ds[15]) == 'vergebl.')
					$dir = "0";
				elseif (trim($ds[14]) == 'gehend')
					$dir = "-1";
				elseif (trim($ds[14]) == 'kommend')
					$dir = "1";

				$this->data[] = array('pos' => $ds[19], 'dir' => $dir, 'date' => str_replace('.', '-', $ds[1]).' '.$ds[2], 'number' => $ds[5], 'name' => $ds[6],
					'duration' => $ds[3]);
			}
		}
		else
			$this->error('Phone: Auerswald', 'Login failed!');

		// 3. logout
		if ((int)$login->login > 1)
		{
			$url = 'http://'.$this->server.'/appclose';
			$context = stream_context_create(array('http' => array('method' => 'POST', 'header' => 'Cookie: '.implode('; ', $cookie))));
			file_get_contents($url, false, $context);
		}	
		else
		{
			$url = 'http://'.$this->server.'/unlogAdmin?loginRechte=3&loginName='.$this->user.'&tnId=0';
			file_get_contents($url);
		}
	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new phone_auerswald(array_merge($_GET, $_POST));
echo $service->json();

?>
