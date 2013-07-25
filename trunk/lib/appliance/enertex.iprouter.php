<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß
 * @copyright   2012
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */


// get config-variables 
require_once '../includes.php';
require_once const_path_system.'service.php';


/**
 * This service reads some information from an enertex knxnet/iprouter
 */
class enertex_iprouter extends service
{
	// A delay between a write and a read
	var $delay = 10000;

	/**
	 * Converts a string to an array
	 */
	private function str2array($text)
	{
		$ret = array();

		foreach (explode("\r\n", $text) as $line)
		{
			list($key, $val) = explode(':', $line, 2);
			$key = strtolower(str_replace(array(' ', '-', '.', '(', ')'), array('_', '_', '', '', ''), trim($key)));
			$val = trim($val);

			if ($key != '' and $val != '')
				$ret[$key] = $val;
		}

		return $ret;
	}

	/**
	 * Open the connection
	 */
	public function open()
	{
		$this->fp = fsockopen($this->server, '23', $errno, $errstr, 3);

		if (!$this->fp)
			$this->error('enertex IP-Router', $errstr.' ('.$errno.')');
		else
			usleep(10 * $this->delay);
	}

	/**
	 * Read the data
	 */
	public function run()
	{
		$this->open();

		if ($this->fp)
		{
			if (substr(fread($this->fp, 1024), -5, 4) == "ert>")
			{
				// version
				usleep($this->delay);
				fputs($this->fp, "version\r\n");

				usleep($this->delay);
				$version = "ert> ".fread($this->fp, 1024);
				$this->debug($version, 'enertex KNXnet/IP-Router');

				// stats
				usleep($this->delay);
				fputs($this->fp, "stats\r\n");

				usleep($this->delay);
				$stats = fread($this->fp, 1024);
				$this->debug($stats);

				// date
				usleep($this->delay);
				fputs($this->fp, "date\r\n");

				usleep($this->delay);
				$dateutc = str_replace("date\r\n", "\r\ndate:", fread($this->fp, 1024));
				$this->debug($dateutc);

				$this->data = $this->str2array($version.$stats.$dateutc);
				$this->data["uptime"] = substr($this->data["uptime"], 0, -6);

				// tunnel
				usleep($this->delay);
				fputs($this->fp, "tunnel\r\n");

				usleep($this->delay);
				$tunnels = fread($this->fp, 1024);
				$this->debug($tunnels);

				foreach ($this->str2array($tunnels) as $tunnelid => $tunneltxt)
				{
					if (strpos($tunneltxt, 'open') > 0)
					{
						usleep($this->delay);
						fputs($this->fp, "tunnel ".$tunnelid."\r\n");

						usleep($this->delay);
						$this->data['tunnels'][$tunnelid] = $this->str2array(fread($this->fp, 1024));
					}
				}

				$this->debug($this->data, 'data');
			}
		}

		$this->close();
	}

	/**
	 * Close connection
	 */
	public function close()
	{
		if ($this->fp)
		{
			usleep($this->delay);
			fputs($this->fp, "logout\r\n");

			fclose($this->fp);
		}
	}

}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

/*
Array
(
	[firmware_version] => 1.015
	[uptime] => 7:55
	[tx_to_ip_all] => 10864 (ca. 22 t/m, 0 t/s)
	[tx_to_knx] => 1797 (ca. 3 t/m, 0 t/s)
	[rx_from_knx] => 2234 (ca. 4 t/m, 0 t/s)
	[overflow_to_ip] => 0
	[overflow_to_knx] => 0
	[tx_tunnel_re_req] => 1
	[date] => 21:10:55 18.12.2012 (UTC)
	[1] => Array
		(
			[tunnel_1] => open (CCID 97)
			[knx_address] => 15.15.011
			[ip_control] => 192.168.45.10:3672
			[tx_tun_req] => 2422
			[tx_tun_re_req] => 0
			[rx_tun_req] => 141
			[rx_tun_re_req_identified] => 0
			[rx_tun_req_wrong_seq] => 0
		)

)
*/

$service = new enertex_iprouter(array_merge($_GET, $_POST));
echo $service->json();

?>
