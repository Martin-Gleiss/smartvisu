<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Martin Gleiß, Wolfram v. Hülsen
 * @copyright   2012 - 2021
 * @license     GPL [http://www.gnu.de]
 *
 * based on a php Telnet class from Dalibor Andzakovic and others 
 * (found in https://github.com/ngharo/Random-PHP-Classes/blob/master/Telnet.class.php)
 * -----------------------------------------------------------------------------
 */


// get config-variables 
require_once '../includes.php';
require_once const_path_system.'service.php';

// telnet control characters
define ('IAC',  chr(255));
define ('_NUL', chr(0));
define ('DC1',  chr(17));
define ('WILL', chr(251));
define ('WONT', chr(252));
define ('_DO',  chr(253));
define ('DONT', chr(254));
define ('SGA',  chr(3));
define ('NAWS', chr(31));
define ('ECH0', chr(1));
define ('EOR',  chr(25));

/**
 * This service reads some information from an enertex knxnet/iprouter
 */
class enertex_iprouter extends service
{
	// A delay between a write and a read in microseconds
	var $delay = 10000;
	
	var $timeout = 10; //connection timeout in seconds
	
	// stream timeout in seconds plus microseconds 
	// TO DO: is this needed?
	var $stream_timeout_usec = 0;
	var $stream_timeout_sec = 1;
		
	var $global_buffer = '';

	/**
	 * initialization of some parameters
	 */
	public function init($request)
	{
		parent::init($request);
			
		$defaultServer = defined('config_appliance_iprouter_server') ? config_appliance_iprouter_server : null;
		$defaultPass =  defined('config_appliance_iprouter_pass') ? config_appliance_iprouter_pass : null;
		
		$this->server = (isset($request['server']) && trim($request['server']) != "") ? trim($request['server']) : $defaultServer;
		$this->pass = (isset($request['pass']) && trim($request['pass']) != "") ? trim($request['pass']) : $defaultPass;
				
	}
	
	/**
	 * Converts a string to an array
	 */
	private function str2array($text)
	{
		$ret = array();

		foreach (explode("\r\n", $text) as $line)
		{
			if (strpos($line, ':') === false)
				continue;
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
		$this->socket = @fsockopen($this->server, '23', $errno, $errstr, $this->timeout);

		if ($this->socket === false) 
			$this->error('enertex IP-Router', $errstr.' ('.$errno.')');
		else
		{
			$this->debug($this->socket, 'Received file pointer');
			usleep(10 * $this->delay);	
			// start negotiation of TELNET options
			$this->write(IAC.WONT.NAWS . IAC.WONT.SGA . IAC.DONT.SGA . IAC.DONT.ECH0);
		}
	}

	/**
	 * Read the data
	 */
	public function run()
	{
		$this->open();

		if ($this->socket !== false)
		{
			$this->prompt = "";
			
			// login procedure with password
			if (strpos($this->readTo($this->prompt), 'Password:') !== false) { 
				$this->write($this->pass);
				if (strpos($this->readTo($this->prompt), 'Wrong password') !== false) {
					$this->error('enertex IP-Router', 'Connection closed, wrong password!');
					$this->close();
				}
			}

			if (strpos($this->buffer, '#') === false) {
				$this->prompt = "#";
				$this->readTo($this->prompt);
			}
			
			$this->debug($this->global_buffer, 'TELNET response');
		}
			
		if ($this->socket !== false)
		{	
			$this->prompt = "#";

			// version
			$this->write("version");
			$version = $this->readTo($this->prompt);
			$this->debug($version, 'enertex KNXnet/IP-Router');

			// stats
			$this->write("stats");
			$stats = $this->readTo($this->prompt);
			$this->debug($stats);

			// date
			$this->write("date");
			$dateutc = str_replace("date\r\n", "\r\ndate:", $this->readTo($this->prompt));
			$this->debug($dateutc);
			
			//ifconfig
			$this->write("ifconfig");
			$ifconfig = $this->readTo($this->prompt);
			$this->debug($ifconfig);
			
			//tpconfig
			$this->write("tpconfig");
			$tpconfig = $this->readTo($this->prompt);
			$this->debug($tpconfig);
			$tpconfig = str_replace('Device'.chr(13).chr(10),'Dev ', $tpconfig);
			$tpconfig = preg_replace('/Serial number/', 'IP Dev Ser Num', $tpconfig, 1);
			$tpconfig = preg_replace('/Serial number/', 'App Dev Ser Num', $tpconfig, 1);

			//free
			$this->write("free");
			$free = $this->readTo($this->prompt);
			$this->debug($free);
			
			$this->data = $this->str2array($version.$stats.$dateutc.$ifconfig.$tpconfig.$free);

			//lcconfig
			$this->write("lcconfig");
			$lcconfig = $this->readTo($this->prompt);
			$this->debug($lcconfig);
			$lcparts = explode(' -> ', str_replace(array('IP', 'KNX'), array('',''), $lcconfig));
			$this->data += $this->str2array($lcparts[0]);
			$this->data['knx_to_ip'] = $this->str2array($lcparts[1]);
			$this->data['ip_to_knx'] = $this->str2array($lcparts[2]);
			

			// tpratemax
			$this->write("tpratemax");
			$tpratemax = $this->readTo($this->prompt);
			$tpratemax = substr($tpratemax, 0, strpos($tpratemax, 'Usage')-3);
			$this->debug($tpratemax);
			$this->data['send_to_tp'] = substr($tpratemax,12);
			
			// apdu
			$this->write("apdu");
			$apdu = $this->readTo($this->prompt);
			$this->debug($apdu);
			$apdu = substr($apdu, 0, strpos($apdu, 'Usage')-3);
			$this->data['knx_max_telegr_length'] = substr(strrchr($apdu, 'telegram '),9);
			
			//tunneltime
			$this->write("tunneltime");
			$tunneltime = $this->readTo($this->prompt);
			$this->debug($tunneltime);
			$tunneltime = substr($tunneltime, 0, strpos($tunneltime, 'Usage')-5);
			$this->data['tun_udp_exp_max_time'] = substr(strrchr($tunneltime, 'tunnelling '),11);
			
			// tunnel
			$this->write("tunnel");
			$tunnels = $this->readTo($this->prompt);
			$this->debug($tunnels);

			foreach ($this->str2array($tunnels) as $tunnelid => $tunneltxt)
			{
				if($tunnelid =='tunnels_open')
					continue;
				$this->write("tunnel ".$tunnelid);
				$this->data['tunnels'][$tunnelid] = $this->str2array($this->readTo($this->prompt));
			}
			
			$this->close();
			$this->data['devicetype'] = explode('-',$this->data['hardware_type'])[3] == '13' ? 'Router' : 'Interface';
		}
	}

	/**
	 * Close connection
	 */
	public function close()
	{
		if ($this->socket !== false)
		{
			$this->write('logout');
			usleep(15 * $this->delay);  // wait 150 ms before closing the socket
			fclose($this->socket);
			$this->socket = false;
		}
	}

	/**
	 * Gets character from the socket
	 *
	 * @return void
	 */
	protected function getc() {
		stream_set_timeout($this->socket, $this->stream_timeout_sec, $this->stream_timeout_usec);
		$c = fgetc($this->socket);
		$this->global_buffer .= $c;
		return $c;
	}

	/**
	 * Reads characters from the socket and adds them to command buffer.
	 * Handles telnet control characters. Stops when prompt is ecountered.
	 *
	 * @param string $prompt
	 * @return boolean
	 */
	protected function readTo($prompt) {
		
		usleep (2 * $this -> delay);	// wait 20 ms before reading
		// clear the buffer
		$this->buffer = '';

		$until_t = time() + $this->timeout;
		do {
			// time's up (loop can be exited at end or through continue!)
			if (time() > $until_t) {
				$this->error("enertex IP-Router", "Couldn't find the requested : '".$prompt."' within ".$this->timeout."seconds");
				return "";
			}

			$c = $this->getc();

			if (empty($prompt)) {
				if ($c === FALSE || (!empty($this->buffer && $c == IAC))) {
					return $this->buffer;
				}
			} else {
				if ($c === FALSE) {
					$this->error("enertex IP-Router", "Couldn't find the requested : '" . $prompt . "', it was not in the data returned from server: " . $this->buffer);
					return "";
				}
			}

			// Interpreted As Command
			if ($c == IAC) {
				if ($this->negotiateTelnetOptions()) {
					continue;
				}
			}
			
			// append current char to global buffer
			$this->buffer .= $c;

			// we've encountered the prompt. Break out of the loop
			if (!empty($prompt) && preg_match("/{$prompt}$/", $this->buffer)) {
				return $this->buffer;
			}

		} while ($c != _NUL || $c != DC1);
	}

	/**
	 * Write command to a socket
	 *
	 * @param string $buffer Stuff to write to socket
	 * @param boolean $add_newline Default TRUE, adds newline to the command
	 * @return boolean
	 */
	protected function write($buffer, $add_newline = TRUE) {
		
		usleep ($this -> delay);	// wait 10 ms before writing
		
		// clear buffer from last command
		$this->buffer = '';

		if ($add_newline == TRUE) {
			$buffer .= "\r\n";
		}

		$this->global_buffer .= $buffer;
		if (!fwrite($this->socket, $buffer) < 0) {
			$this->error("enertex IP-Router","Error writing to socket");
		}

		return true;
	}

	/**
	 * Telnet control characters
	 *
	 * @param string $command Character to check
	 * @return boolean
	 */
	protected function negotiateTelnetOptions() {
		$c = $this->getc();

		if ($c != IAC) {
			if (($c == _DO) || ($c == DONT)) {
				$opt = $this->getc();
				fwrite($this->socket, IAC . WONT . $opt);
			} else if (($c == WILL) || ($c == WONT)) {
				$opt = $this->getc();
				fwrite($this->socket, IAC . DONT . $opt);
			} else {
				$this->error('enertex IP-Router', 'Error: unknown control character ' . ord($c));
			}
		} else {
			//$this->error('enertex IP-Router', 'Error: double IAC command detected');
		}

		return true;
	}

}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

/*
Array
(
	[hardware_type] => 00-00-00-13-00-01 
	[add_hardw_type] => 00-00-00-25-00-01 
	[firmware_version] => 1.062 
	[uptime] => 00:01 
	[tx_to_ip_all] => 0 (ca. 0 t/m) 
	[tx_to_knx] => 0 (ca. 0 t/m) 
	[rx_from_knx] => 0 (ca. 0 t/m) 
	[overflow_to_ip] => 0 
	[overflow_to_knx] => 0 
	[tx_tunnel_re_req] => 0 
	[tp_bus_voltage] => 28.75 V 
	[tp_bus_current] => 16.2 mA 
	[tp_temperature] => 21.5 C 
	[tx_tp_rate] => 50 T/s (= 100 %) 
	[date] => 11:08:27 14.08.2021 (UTC) 
	[ip_mode] => DHCP 
	[ip] => 192.168.2.117 
	[subnet_mask] => 255.255.255.0 
	[gateway] => 192.168.2.1 
	[ntp_server] => pool.ntp.org (176.221.42.125) 
	[dns_server] => 192.168.2.1 
	[sys_multicast] => 224.0.23.12 
	[rt_multicast] => 224.0.23.12 
	[hardware_addr] => 70:b3:d5:dc:87:79 
	[knx_bus_state] => up 
	[ip_dev_knx_address] => 15.15.000 
	[ip_dev_ser_num] => 00-a6-13-00-02-ce 
	[app_dev_knx_address] => 15.15.255 
	[app_dev_ser_num] => 00-a6-25-80-02-ce 
	[used_stack_memory] => 7 % 
	[allocated_memory] => 81 % 
	[unused_memory] => 18 % 
	[tp_tx_buffer] => 0 % 
	[tp_tx_buffer_max] => 0 % 
	[tp_rx_buffer_max] => 0 %
	[coupler_type] => line coupler 
	[knx_to_ip] => Array 
	(
		[ga__0_13] => route 
		[ga_14_15] => filter 
		[ga_16_31] => block 
		[ind_addr] => filter 
		[broadcast] => route 
	) 
	[ip_to_knx] => Array 
	( 
		[ga__0_13] => route 
		[ga_14_15] => filter 
		[ga_16_31] => block 
		[indaddr] => filter 
		[broadcast] => route 
		[check_ia_rout] => disabled 
		[indaddrtlg] => individually addressed telegrams are 3 times repeated 
	) 
	[send_to_tp] => no limit, sending with maximum performance to TP 
	[knx_max_telegr_length] => 248 
	[tun_udp_exp_max_time] => 1.0 s 
	[tunnels] => Array 
	( 
		[1] => Array 
		( 
			[tunnel_1] => open (CCID 97)
			[knx_address] => 15.15.011
			[hpai_control] => 192.168.45.10:3672
			[hpai_data] => 192.168.45.10:3672
			[connect_type] => TUNNEL_CONNECTION
			[communication] => UDP CONNECTION
			[tx_tun_req] => 2422
			[tx_tun_rereq] => 0
			[rx_tun_req] => 141
			[rx_tun_rereq_identified] => 0
			[rx_tun_req_wrong_seq] => 0
			[current_tunnel_buffer] => 0%
			[connected_since_utc] => 16:26:16 29012019
		)
		[2] => Array 
		( 
			[tunnel_2] => closed 
			[knx_address] => 15.15.011 
		)
		.
		.
		.
		[8] => Array 
		( 
			[tunnel_8] => closed 
			[knx_address] => 15.15.017 
		)
	)
	[devicetype] => Router
)
*/

$service = new enertex_iprouter(array_merge($_GET, $_POST));
echo $service->json();

?>
