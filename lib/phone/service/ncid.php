<?php
/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      KERVIEL Pierre-Yves
 * @copyright   2014
 * @license     GPL [http://www.gnu.de]
 *              To get the phonelist from NCID daemon
 *		On daemon side, you must to activate the 'send cidlog' key
 * 		to be able to receive the list of the incoming calls only
 *		
 *		
 * -----------------------------------------------------------------------------
 */


require_once '../../../lib/includes.php';
require_once const_path_system.'phone/phone.php';


/**
 * This class reads the phonelist of an ncid server
 */
class phone_ncid extends phone
{
	public function run()
	{
		// Build the connection to the daemon
		// Get the server IP and the TCP port from the configuration infos
		//$infos = explode(":", $this->server);
		// socket creation
		$ncid_socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
		if ($ncid_socket === false) {
			$this->debug("NCID : socket creation failed", 'NCID');
		}
		// socket connection
		$ncid_result = socket_connect($ncid_socket, $this->server, $this->port);
		if ($ncid_result === false) {
                        $this->debug("NCID : socket connection failed", 'NCID');
                }
		// read the the flow line by line from the daemon
		// When the 300 code is read, the connection can be closed
		$read_buffer = '';
		$line_index = 0;
		$continued_flag = true;
		while ($continued_flag) {
			$out = socket_read($ncid_socket, 256, PHP_NORMAL_READ);
			if (substr($out,0,3) == '300') {
				// Last line of the received list
				// we can close the socket
				$continued_flag = false;
			}
			elseif (substr($out,0,3) == '200') {
				// First line of the received list
				// do nothing
				$continued_flag = true;
			}
			else {
				// in the other cases
				// decode the line and build the response 
				// line structue : 
				// CIDLOG: *DATE*01092014*TIME*1207*LINE*RTC*NMBR*0606060606*MESG*NONE*NAME*Name*
				$exploded_line = explode('*', $out);
				// if no name given, put empty string
				if ($exploded_line[12] == 'OUT-OF-AREA') {
					$exploded_line[12] = '';
				}
				// if number is PRIVATE (unknown) put '-'
				if ($exploded_line[8] == 'PRIVATE') {
					$exploded_line[8] = '-';
                                }
				$this->data[] = array('pos' => $line_index, 'dir' => '1', 'date' => substr($exploded_line[2], 2,2).'.'.substr($exploded_line[2], 0,2).'.'.substr($exploded_line[2], 4,4).' '.substr($exploded_line[4], 0,2).':'.substr($exploded_line[4], 2,2), 'number' => $exploded_line[8], 'name' => $exploded_line[12], 'duration' => '--:--');
    			}
		$line_index ++;
		}
		// sort the retreive list to have LIFO order
		krsort($this->data);
		// end of connection
		socket_close($ncid_socket);

	}
}


// -----------------------------------------------------------------------------
// call the service
// -----------------------------------------------------------------------------

$service = new phone_ncid(array_merge($_GET, $_POST));
echo $service->json();

?>
