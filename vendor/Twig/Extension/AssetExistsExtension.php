<?php

class Twig_Extension_AssetExistsExtension extends Twig_Extension
{

    public function getFunctions()
    {
        return array(
                'asset_exists' => new Twig_Function_Method($this, 'asset_exists'),
        );
    }

    public function asset_exists($path)
    {
        $webRoot = realpath(dirname(__DIR__, 3));
        $toCheck = $webRoot . '/widgets/' . $path;
        // check if the file exists
        if (!is_file($toCheck))
        {
            return false;
        }

        // check if file is well contained in web/ directory (prevents ../ in paths)
        if (strncmp($webRoot, $toCheck, strlen($webRoot)) !== 0)
        {
            return false;
        }
        return true;
    }

    public function getName()
    {
        return 'asset_exists';
    }

}
