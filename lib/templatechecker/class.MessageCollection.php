<?php

/**
 * -----------------------------------------------------------------------------
 * @package     smartVISU
 * @author      Thomas Ernst
 * @copyright   2016
 * @license     GPL [http://www.gnu.de]
 * -----------------------------------------------------------------------------
 */

/**
 * Collection of messages
 */
class MessageCollection {

	/**
	 * Constant: Severity "Error"
	 */
	const SEVERITY_ERROR = 'E';

	/**
	 * Constant: Severity "Warning"
	 */
	const SEVERITY_WARNING = 'W';

	/**
	 * Constant: Severity "Information"
	 */
	const SEVERITY_INFO = 'I';

	/**
	 * Constant: Severity "None"
	 */
	const SEVERITY_NONE = 'N';

	/**
	 * List of messages
	 * @var array 
	 */
	private $messages;

	/**
	 * Number of messages by severity
	 * @var array 
	 */
	private $messageCount;

	/**
	 * Constructor
	 */
	function __construct() {
		$this->messages = array();
		$this->messageCount = array(
			self::SEVERITY_ERROR => 0,
			self::SEVERITY_WARNING => 0,
			self::SEVERITY_INFO => 0,
		);
	}

	/**
	 * Add error to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param integer $lineNo Line number
	 * @param string $line Line text
	 * @param array $data Additional data
	 */
	public function addError($test, $message, $lineNo = 0, $line = '', $data = array()) {
		$this->addMessage(MessageCollection::SEVERITY_ERROR, $test, $message, $lineNo, $line, $data);
	}

	/**
	 * Add warning to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param integer $lineNo Line number
	 * @param string $line Line text
	 * @param array $data Additional data
	 */
	public function addWarning($test, $message, $lineNo = 0, $line = '', $data = array()) {
		$this->addMessage(MessageCollection::SEVERITY_WARNING, $test, $message, $lineNo, $line, $data);
	}

	/**
	 * Add information to list of messages
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param integer $lineNo Line number
	 * @param string $line Line text
	 * @param array $data Additional data
	 */
	public function addInfo($test, $message, $lineNo = 0, $line = '', $data = array()) {
		$this->addMessage(MessageCollection::SEVERITY_INFO, $test, $message, $lineNo, $line, $data);
	}

	/**
	 * Add message to list of messages
	 * @param string $severity Severity
	 * @param string $test Name of test
	 * @param string $message Message
	 * @param integer $lineNo Line number
	 * @param string $line Line text
	 * @param array $data Additional data
	 */
	public function addMessage($severity, $test, $message, $lineNo = 0, $line = '', $data = array()) {
		$this->messages[] = array(
			'severity' => $severity,
			'test' => $test,
			'message' => $message,
			'lineNo' => $lineNo,
			'line' => $line,
			'data' => $data
		);
		$this->messageCount[$severity] += 1;
	}

	/**
	 * return list of messages
	 * @return array
	 */
	public function getMessages() {
		return $this->messages;
	}
	
	/**
	 * return grouped list of messages
	 * @return nested array severity->test->messages
	 */
	public function getMessagesGrouped() {
		$ret = array(
			self::SEVERITY_ERROR => array(),
			self::SEVERITY_WARNING => array(),
			self::SEVERITY_INFO => array(),
			self::SEVERITY_NONE => array(),
		);
		
		foreach($this->messages as $message) {
			if (!array_key_exists($message['test'], $ret[$message['severity']]))
					$ret[$message['severity']][$message['test']] = array();
			$ret[$message['severity']][$message['test']][] = $message;
		}
		return $ret;
	}

	/**
	 * return number of messages for certain severity
	 * @param string $severity Severity
	 * @return int number of messages
	 */
	public function getMessageCount($severity) {
		if (array_key_exists($severity, $this->messageCount))
			return($this->messageCount[$severity]);
		return 0;
	}

	/**
	 * return number of messages for all severities
	 * @return array severity->count
	 */
	public function getMessageCounts() {
		return $this->messageCount;
	}
	
	/**
	 * return total number of messages
	 * @return int number of messages
	 */
	function getTotalMessageCount() {
		$total = 0;
		foreach ($this->messageCount as $severity => $count)
			$total += $count;
		return $total;
	}

	/**
	 * return maximum severity
	 * @return string
	 */
	function getMaxSeverity() {
		if ($this->messageCount[self::SEVERITY_ERROR] != 0)
			return self::SEVERITY_ERROR;
		if ($this->messageCount[self::SEVERITY_WARNING] != 0)
			return self::SEVERITY_WARNING;
		if ($this->messageCount[self::SEVERITY_INFO] != 0)
			return self::SEVERITY_INFO;
		return self::SEVERITY_NONE;
	}

}
