<?php
/**
 * User: raikalber
 * Date: 03.09.2013
 * Time: 16:54
 * Version: 2.0
 */

error_reporting(0);
$shortOptions = 's:d:i::o::c::h';
$longOptions = array('source:', 'dest:', 'input::', 'output::', 'cfilespath::', 'help');

$possibleSchema = array('linknx', 'eibd', 'smarthome.py');

$sendOptions = getopt($shortOptions, $longOptions);
$goOn = true;

function printHelp() {
    global $possibleSchema;

    echo 'Usage: ' .$_SERVER['SCRIPT_FILENAME'] . ' ' . '-s|--source=sourceSchema' . ' ' . '-d|--dest=destinationSchema' . ' ' . '[--input=inputDirectory]' . ' ' . '[--output=outputDirectory]' . ' ' . '[--cfilespath=converterFilesPath]' . "\n\n";
    echo '      sourceSchema one of: ' . implode(', ', $possibleSchema) ."\n";
    echo '      destinationSchema one of: ' . implode(', ', $possibleSchema) ."\n";
    echo '      sourceSchema and destinationSchema should not be the same' . "\n";
    echo '      optional inputDirectory, default "./" '."\n";
    echo '      optional outputDirectory, default "./", if not set, filenames are changed to "destinationSchema.filename.extension" '."\n";
    echo '      optional converterFilesPath, default "./", path to eg. linknx.xml or smarthome.py item files" '."\n";
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

if (array_key_exists('input', $sendOptions)) {
    $inputDirectory =  $sendOptions['input'];
    if (substr($inputDirectory,-1,1) != '/') {
        $inputDirectory .= '/';
    }
} else {
    $inputDirectory = './';
}

if (array_key_exists('output', $sendOptions)) {
    $outputDirectory =  $sendOptions['output'];
    if (substr($outputDirectory,-1,1) != '/') {
        $outputDirectory .= '/';
    }
} else {
    $outputDirectory = './'.$destinationSchema .'.';
}

if (array_key_exists('cfilespath', $sendOptions)) {
    $converterFilesPath =  $sendOptions['cfilespath'];
    if (substr($converterFilesPath, -1,1 != '/')) {
        $converterFilesPath .= '/';
    }
} else {
    $converterFilesPath = './';
}

if (!in_array($sourceSchema,$possibleSchema) || !in_array($destinationSchema, $possibleSchema) || $sourceSchema == $destinationSchema) {
    $goOn = false;
}

if ($goOn === false) {

    printHelp();
    exit;
}


if ($sourceSchema == 'linknx') {

    $returnData = array('ids' => array(), 'gads' => array());

    if (file_exists($converterFilesPath.'linknx.xml')) {
        $xml = simplexml_load_file($converterFilesPath.'linknx.xml');

        foreach ($xml->objects->object as $oneObject) {

            $returnData['ids'][(string)$oneObject->attributes()->id] = array('gad' => (string)$oneObject->attributes()->gad, 'dpt' => (string)$oneObject->attributes()->type);
            $returnData['gads'][(string)$oneObject->attributes()->gad] = array('id' => (string)$oneObject->attributes()->id, 'dpt' => (string)$oneObject->attributes()->type);

        }
    } else {
        exit('Konnte '.$converterFilesPath.'linknx.xml nicht öffnen.');
    }
}

if ($sourceSchema == 'smarthome.py' || $destinationSchema == 'smarthome.py') {

    $returnData = readSmarthomePyItems($converterFilesPath);
}

$dp = dir($inputDirectory);
if (!file_exists($outputDirectory)) {
    mkdir($outputDirectory);
}

$inputDataArray = array();

while (false !== ($dirEntry = $dp->read())) {
    if ( strpos($dirEntry, '.html') ) {

        $inputDataArray[$dirEntry] = file_get_contents($inputDirectory . $dirEntry);
    }
}
$dp->close();

foreach ($inputDataArray as $inputDataFilename => $inputDataText) {

    switch ($destinationSchema) {

        case 'eibd':

            foreach($returnData['ids'] as $oneIdKey => $oneIdArray) {

                $inputDataText = str_replace($oneIdKey, $oneIdArray['gad'].'/'.$oneIdArray['dpt'], $inputDataText);
            }
            $inputDataArray[$inputDataFilename] = $inputDataText;
            break;
        case 'smarthome.py':

            foreach ($returnData['gads'] as $oneIdKey => $oneIdArray) {

                $searchString = "#'". $oneIdKey . "/.*?'#";
                $inputDataText = preg_replace($searchString, "'".trim($oneIdArray['id'])."'", $inputDataText);
            }
            $inputDataArray[$inputDataFilename] = $inputDataText;
            break;
    }
}

foreach ($inputDataArray as $inputDataFilename => $inputDataText) {

    file_put_contents($outputDirectory . $inputDataFilename, $inputDataText);
}


function readSmarthomePyItems($itemSourcePath) {

    $returnData = array('ids' => array(), 'gads' => array());

    $dp = dir($itemSourcePath);

    while (false !== ($entry = $dp->read())) {

        $layers = array();

        if ( substr($entry, 0, 6) == 'items_')  {

            $fp = fopen($itemSourcePath. $entry, 'r');

            while ($oneLine = trim(fgets($fp))) {

                $actualLayer = substr_count($oneLine, '[');

                if ($actualLayer > 0) {

                    $oneLine = strtr($oneLine, array('[' => '', ']' => ''));
                    $layers[$actualLayer] = $oneLine;
                    $itemNameFound = false;
                    $dataSaved = false;
                    $itemName = '';
                    $dpt = false;

                } else {

                    $knxCommand = explode ('=', $oneLine);

                    if (trim($knxCommand[0]) == 'knx_dpt') {
                        switch (trim($knxCommand[1])) {
                            case "1":
                                $dpt = '1.001';
                                break;
                            case "2":
                                $dpt = '2.xxx';
                                break;
                            case "3":
                                $dpt = '3.xxx';
                                break;
                            case "4002":
                                $dpt = '4.002';
                                break;
                            case "5":
                                $dpt = '5.xxx';
                                break;
                            case "5001":
                                $dpt = '5.001';
                                break;
                            case "6":
                                $dpt = '6.xxx';
                                break;
                            case "7":
                                $dpt = '7.xxx';
                                break;
                            case "8":
                                $dpt = '8.xxx';
                                break;
                            case "9":
                                $dpt = '9.xxx';
                                break;
                            case "10":
                                $dpt = '10.xxx';
                                break;
                            case "11":
                                $dpt = '11.xxx';
                                break;
                            case "12":
                                $dpt = '12.xxx';
                                break;
                            case "13":
                                $dpt = '13.xxx';
                                break;
                            case "14":
                                $dpt = '14.xxx';
                                break;
                            case "16000":
                                $dpt = '16.000';
                                break;
                            case "16001":
                                $dpt = '16.001';
                                break;
                            case "17":
                                $dpt = '17.xxx';
                                break;
                            case "20":
                                $dpt = '20.xxx';
                                break;
                            case "24":
                                $dpt = '24.xxx';
                                break;
                        }
                    }

                    if ( ((trim($knxCommand[0]) == 'knx_listen') || (trim($knxCommand[0]) == 'knx_send')) && $itemNameFound === false) {

                        $itemNameFound = true;

                        foreach ($layers as $oneItem) {

                            $itemName .= $oneItem .'.';
                        }
                        $itemName = substr($itemName, 0,-1);

                    }

                    if ( ($itemName) && ($dpt) && ($dataSaved === false)) {
                        $dataSaved = true;
                        $returnData['gads'][trim($knxCommand[1])] = array('id' => trim($itemName), 'dpt' => $dpt);
                        $returnData['ids'][trim($itemName)]       = array('gad' => trim($knxCommand[1]), 'dpt' => $dpt);

                    }
                }
            }

        }
    }
    return $returnData;
}

