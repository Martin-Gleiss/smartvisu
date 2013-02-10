<?php
/**
 * Created by JetBrains PhpStorm.
 * User: raikalber
 * Date: 25.01.13
 * Time: 16:54
 * To change this template use File | Settings | File Templates.
 */

$shortOptions = 's:d:i::o::h';
$longOptions = array('source:', 'dest:', 'input::', 'output::', 'help');

$possibleSchema = array('linknx', 'eibd', 'smarthome.py', 'domotiga');

$sendOptions = getopt($shortOptions, $longOptions);
$goOn = true;

function printHelp() {
    global $possibleSchema;

    echo 'Usage: ' .$_SERVER['SCRIPT_FILENAME'] . ' ' . '-s|--source=sourceSchema' . ' ' . '-d|--dest=destinationSchema' . ' ' . '[--input=inputDirectory]' . ' ' . '[--output=outputDirectory]' . "\n\n";
    echo '      sourceSchema one of: ' . implode(', ', $possibleSchema) ."\n";
    echo '      destinationSchema one of: ' . implode(', ', $possibleSchema) ."\n";
    echo '      optional inputDirectory, default "./" '."\n";
    echo '      optional outputDirectory, default "./", filenames are changed to "destinationSchema.filename.extension" '."\n";
    echo "\n";
}

if (array_key_exists('h', $sendOptions) || array_key_exists('help', $sendOptions)) {
    printHelp();
    exit;
}
if (array_key_exists('s', $sendOptions) || array_key_exists('source', $sendOptions)) {
    $sourceSchema = array_key_exists('s', $sendOptions) ? $sendOptions['s'] : $sendOptions['source'];
} else {
    $goOn = false;
}
if (array_key_exists('d', $sendOptions) || array_key_exists('dest', $sendOptions)) {
    $destinationSchema = array_key_exists('d', $sendOptions) ? $sendOptions['d'] : $sendOptions['dest'];
} else {
    $goOn = false;
}

$inputDirectory = array_key_exists('input', $sendOptions) ? $sendOptions['input'] : './';
$outputDirectory = array_key_exists('output', $sendOptions) ? $sendOptions['output'] : './';

if (!in_array($sourceSchema,$possibleSchema) || !in_array($destinationSchema, $possibleSchema) || $sourceSchema == $destinationSchema) {
    $goOn = false;
}

if ($goOn === false) {

    printHelp();
    exit;
}


if ($sourceSchema == 'linknx') {

    $returnData = array('ids' => array(), 'gads' => array());

    if (file_exists('linknx.xml')) {
        $xml = simplexml_load_file('linknx.xml');

        foreach ($xml->objects->object as $oneObject) {

            $returnData['ids'][(string)$oneObject->attributes()->id] = array('gad' => (string)$oneObject->attributes()->gad, 'dpt' => (string)$oneObject->attributes()->type);
            $returnData['gads'][(string)$oneObject->attributes()->gad] = array('id' => (string)$oneObject->attributes()->id, 'dpt' => (string)$oneObject->attributes()->type);

        }
    } else {
        exit('Konnte linknx.xml nicht öffnen.');
    }
}

$dp = dir($inputDirectory);
if (!file_exists($outputDirectory)) {
    mkdir($outputDirectory);
}

while (false !== ($entry = $dp->read())) {
    if ( strpos($entry, '.html') ) {
        $inputData = file_get_contents($inputDirectory . $entry);

        foreach($returnData['ids'] as $oneIdKey => $oneIdArray) {

            $inputData = str_replace($oneIdKey, $oneIdArray['gad'].'/'.$oneIdArray['dpt'], $inputData);
        }

        file_put_contents($outputDirectory . $entry, $inputData);
    }
}
$dp->close();