<?php
$timezone = new DateTimeZone($_GET['timezone']);
$timeData = $timezone->getTransitions(time(), time()+ 23328000);
echo json_encode($timeData);
?>