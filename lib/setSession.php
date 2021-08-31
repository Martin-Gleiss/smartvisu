<?php

	if (isset($_REQUEST)) {
		session_start();

		foreach ($_REQUEST as $key => $val) {
			if ($val != 'unset') {
				echo 'set';
				$_SESSION["$key"] = $val;
			} else {
				echo 'unset';
				unset($_SESSION["$key"]);
			}
		}
		echo json_encode(array('title' => 'Configuration', 'text' => 'Session variable saved.'));
	} else {
		header("HTTP/1.0 600 smartVISU Config Error");
		echo json_encode(array('title' => 'Configuration', 'text' => 'No session variable sent!'));
	}

?>