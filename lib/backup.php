<?php

require_once "includes.php";
require_once "functions.php";

// unzip allowed files form scr archive to dst
function unzip($src, $dst, $allowedfiletypes): array
{
    $fileskiplist = [];
    mkdir($dst, 0777, true);
    $zip = new ZipArchive;
    if ($zip->open($src) === true) {

        for ($i = 0; $i < $zip->numFiles; $i++) {
            $fileName = $zip->getNameIndex($i);
            $filePath = $zip->statIndex($i)["name"];

            if ($filePath[strlen($filePath) - 1] == "/") {
                mkdir($dst . "/" . $filePath, 0777, true);
            } else {
                $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
                if (in_array($fileExt, $allowedfiletypes)) {
                    copy('zip://' . $src . '#' . $fileName, $dst . "/" . $filePath);
                } else
                    $fileskiplist[] = $filePath;
            }
        }
        $zip->close();
    }
    return $fileskiplist;
}

// zip scr directories or files to dest archive, exclude directories or files form exclude list
function zip($sourcelist, $destination, $excludelist = []): bool
{
    mkdir(pathinfo($destination, PATHINFO_DIRNAME), 0777, true);

    if (file_exists($destination)) {
        unlink($destination);
    }

    $zip = new ZipArchive();
    if (!$zip->open($destination, ZIPARCHIVE::CREATE)) {
        return false;
    }
    foreach ($sourcelist as $source) {
        $source = realpath($source);
        if (is_dir($source) === true) {

            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($source), RecursiveIteratorIterator::SELF_FIRST);

            $sourcesplit = explode("/", $source);
            $zip->addEmptyDir(end($sourcesplit));
            $source = substr($source, 0, strrpos($source, "/"));

            foreach ($files as $file) {
                // Ignore "." and ".." folders
                if (in_array(substr($file, strrpos($file, '/') + 1), array('.', '..')))
                    continue;

                $skip = false;
                foreach ($excludelist as $exclude) {
                    if (realpath($exclude) === '' or realpath($exclude) === false)
                        continue;
                    if (strpos($file, strval(realpath($exclude))) === 0) {
                        $skip = true;
                        break;
                    }
                }
                if ($skip)
                    continue;

                $file = realpath($file);
                if (is_dir($file) === true) {
                    $zip->addEmptyDir(str_replace($source . '/', '', $file . '/'));
                } else if (is_file($file) === true) {
                    $zip->addFromString(str_replace($source . '/', '', $file), file_get_contents($file));
                }
            }
        } else if (is_file($source) === true) {
            $skip = false;
            foreach ($excludelist as $exclude) {
                if (realpath($exclude) === '' or realpath($exclude) === false)
                    continue;
                if (strpos($source, strval(realpath($exclude))) === 0) {
                    $skip = true;
                    break;
                }
            }
            if (!$skip)
                $zip->addFromString(basename($source), file_get_contents($source));
        }
    }
    return $zip->close();
}

// recursive cp function
function rcp($src, $dst)
{
    $dir = opendir($src);
    if (! $dir === false){
        if (!is_dir($dst))
            mkdir($dst, 0777, true);
        while (false !== ($file = readdir($dir))) {
            if (($file != '.') && ($file != '..')) {
                if (is_dir($src . '/' . $file)) {
                    rcp($src . '/' . $file, $dst . '/' . $file);
                } else {
                    copy($src . '/' . $file, $dst . '/' . $file);
                }
            }
        }
        closedir($dir);
    }
}

// accept only post requests
if ($_SERVER['REQUEST_METHOD'] == "POST") {

    $maxpostsize = ini_parse_quantity(ini_get('post_max_size'));
    $maxuploadsize = ini_parse_quantity(ini_get('upload_max_filesize'));

    if (isset($_POST['exportBackup'])) {
        if (!extension_loaded("zip")) {
            header("HTTP/1.0 650 smartVISU Backup Error");
            header('Content-Type: application/json');
            echo json_encode(array('title' => 'Backup', 'text' => trans('backup', 'zip_module_error') . '<br><br>sudo apt install php' . PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . '-zip<br>sudo systemctl restart apache2'));
            exit;
        }

        $tempdir = "../temp/backup/";
        $backupfile = $tempdir . "export.zip";
        $backuplist = ["../pages/", "../dropins/", "../config.ini"];
        $backupexcludelist = ["../pages/base/", "../pages/_template/", "../pages/example1.smarthome/",
            "../pages/example2.knxd/", "../pages/example3.graphic/", "../pages/example4.quad/", "../pages/docu/",
            "../pages/kurzanleitung/"];

        // create zip archive
        zip($backuplist, $backupfile, $backupexcludelist);

        $filename = $GLOBALS['config']['title'] . "_" . config_visu . "_v" . config_version_full . "_config_backup_" .
            date("Y-m-d_H-i-s") . ".zip";

        // send file headers
        header("Content-type: application/octet-stream");
        header("Content-Disposition: attachment;filename=" . $filename);
        header("Access-Control-Expose-Headers:Content-Disposition");
        header("Content-Transfer-Encoding: binary");
        header('Pragma: no-cache');
        header('Expires: 0');
        // add filesize info and php limits
        header('filesize: '. filesize ($backupfile));
        header('maxpostsize: '. $maxpostsize );
        header('maxuploadsize: '. $maxuploadsize);

        // send the file contents.
        set_time_limit(0);
        ob_clean();
        flush();
        readfile($backupfile);

        // delete temp directory
        delTree($tempdir);


    } else if (isset($_POST['restoreBackup'])) {
        if (!extension_loaded("zip")) {
            header("HTTP/1.0 650 smartVISU Backup Error");
            header('Content-Type: application/json');
            echo json_encode(array('title' => 'Backup', 'text' => trans('backup', 'zip_module_error') . '<br><br><span class="allowTextCopy">sudo apt install php' . PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION . '-zip<br>sudo systemctl restart apache2</span>'));
            exit;
        }

        // Check if system temp directory for upload is writeable
        $sys_tempdir = ( ini_get('upload_tmp_dir') ? ini_get('upload_tmp_dir') : sys_get_temp_dir());
        if (!is_writeable($sys_tempdir)) {
            header("HTTP/1.0 650 smartVISU Backup Error");
            header('Content-Type: application/json');
            echo json_encode(array('title' => 'Backup', 'text' => trans('backup', 'import')['tmp_file_error'].': '. $sys_tempdir ));
            exit;
        }

        //if size of uploaded file is larger than alloweed in php.ini return an error
        if ($_FILES["restoreBackupFile"]["error"] == 1) {
            header("HTTP/1.0 650 smartVISU Backup Error");
            header('Content-Type: application/json');
            echo json_encode(array('title' => 'Backup', 'text' => trans('backup', 'import')['filesize_error']));
            exit;
        }

        if ($_FILES["restoreBackupFile"]["error"] == 0) {
            $tempdir = "../temp/backup/";
            $unzipdir = $tempdir . "import/";
            $zipfile = $tempdir . "import.zip";

            //check type of uploaded file, if not zip return an error notify
            $mimes = array('application/x-zip-compressed', 'application/zip');
            if (!in_array($_FILES['restoreBackupFile']['type'], $mimes)) {
                header("HTTP/1.0 650 smartVISU Backup Error");
                header('Content-Type: application/json');
                echo json_encode(array('title' => 'Backup', 'text' => trans('backup', 'import')['filetype_error']));
                exit;
            }

            // create temp directory
            mkdir($tempdir, 0777, true);
            if (move_uploaded_file($_FILES["restoreBackupFile"]["tmp_name"], $zipfile)) {

                $allowedfiletypes = array("mp3", "wav", "mp4", "jpg", "png", "gif", "doc", "docx", "pdf", "txt", "xsl",
                    "xlsx", "html", "htm", "css", "js", "xml", "sql", "db", "sys", "svg", "csv", "ini", "md", "gitkeep",
                    "gitignore", "json");

                // unzip allowed files form archive to temp
                $fileskiplist = unzip($zipfile, $unzipdir, $allowedfiletypes);

                // delete all directories and files which are going to be replaced by the import
                // This does not work properly directly from php, so it has to be a shell command
                $pagesdirlist = scandir($unzipdir . "pages/");
                $pagesdirstring = "";
                foreach ($pagesdirlist as $dir) {
                    if ($dir == '.' or $dir == '..')
                        continue;
                    $pagesdirstring .= " pages/" . $dir . "/";
                }
                shell_exec('cd ..; rm -r dropins/ config.ini' . $pagesdirstring);

                // copy imported directories and files in correct place
                rcp($unzipdir . "pages/", "../pages/");
                rcp($unzipdir . "dropins/", "../dropins/");
                copy($unzipdir . "config.ini", "../config.ini");

                // clear cache and remove temp directory
                delTree("../temp/pagecache/");
                delTree("../temp/twigcache/");
                delTree($tempdir);

                // run the smartVISU shell script to set permissions.
                //This does not work properly directly from php, so it has to be a shell command.
                shell_exec('cd ..; bash setpermissions;');

                // create the success message for notify, containing the command to change the ownership
                // if files with a forbidden file extension where found, list them in notify
                $user = posix_getpwuid(stat("../")["uid"])["name"];
                $echomsg = trans('backup', 'import')['successful'] . '<br>' . trans('backup', 'import')['ownership_command'] . '<br><br><span class="allowTextCopy">sudo chown -R ' . $user . ' ' . realpath('../') . '/</span>';
                if (count($fileskiplist) > 0) {
                    $echomsg .= '<br><br><br>' . trans('backup', 'import')['forbidden_files'] . '<br><br>';
                    foreach ($fileskiplist as $fileskip) {
                        $echomsg .= $fileskip . '<br>';
                    }
                }
                header('Content-Type: application/json');
                echo json_encode(array('title' => 'Backup', 'text' => $echomsg));
                exit;
            } else {
                // if something went wrong on file save, remove the temp directory and return an error notify
                delTree($tempdir);
                header("HTTP/1.0 650 smartVISU Backup Error");
                header('Content-Type: application/json');
                echo json_encode(array('title' => 'Backup', 'text' => trans('backup', 'import')['save_error']));
                exit;
            }
        }
        // if something went wrong on file upload return an error notify
        header("HTTP/1.0 650 smartVISU Backup Error");
        header('Content-Type: application/json');
        echo json_encode(array('title' => 'Backup', 'text' => trans('backup', 'import')['faulty_file'].': '. $_FILES["restoreBackupFile"]["error"]));
        exit;
    }
    // if the command is not backup or restore or file size exeeds post_max_size in php.ini return an error notify
    header("HTTP/1.0 650 smartVISU Backup Error");
    header('Content-Type: application/json');
    echo json_encode(array('title' => 'Backup', 'text' => trans('backup', 'unknown_command')));
    exit;
}
/** php File Upload Errors
    0 => 'There is no error, the file uploaded with success',
    1 => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
    2 => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
    3 => 'The uploaded file was only partially uploaded',
    4 => 'No file was uploaded',
    6 => 'Missing a temporary folder',
    7 => 'Failed to write file to disk.',
    8 => 'A PHP extension stopped the file upload.',
*/
?>
