<?php
/*
 * This file is a part of Solve framework.
 *
 * @author Alexandr Viniychuk <alexandr.viniychuk@icloud.com>
 * @copyright 2009-2014, Alexandr Viniychuk
 * created: 13.11.14 11:43
 */

namespace Solve\AdminPackage;


use Composer\Script\CommandEvent;
use Solve\Kernel\DC;
use Solve\Kernel\Kernel;
use Solve\Utils\FSService;

class Installer {

    public static function onPostPackageInstall(CommandEvent $event) {
        $io = $event->getIO();
        if (!$io->askConfirmation('Would you like to install admin panel? (Y/n) ', true)) {
            return false;
        }

        $projectRoot = realpath(__DIR__ . '/..') . '/';
        $packageRoot = __DIR__ . '/';
        if (!is_dir($projectRoot . 'app')) {
            die('Solve project is not found in ' . $projectRoot . ', exiting...');
        }

        $name    = $io->ask('Enter the app name (admin): ', 'admin');
        $kernel  = Kernel::getMainInstance();
        $appRoot = $projectRoot . 'app/' . ucfirst($name) . '/';
        $kernel->getEnvironment()->setProjectRoot($projectRoot);

        $config = DC::getProjectConfig();
        while ($name && $config->get('applications/' . $name)) {
            $name = $io->ask('Application exists, specify other name: ');
        }
        $config->set('applications/' . $name, $name);
        $config->save();


        FSService::makeWritable($appRoot);
        FSService::makeWritable($projectRoot . 'web/admin/');
        FSService::copyRecursive($packageRoot . 'app/', $appRoot);
        FSService::copyRecursive($packageRoot . 'assets/', $projectRoot . 'web/admin/');
        exec('cd '.$projectRoot.'web/admin/');
        exec('npm install');
        exec('cd '.$projectRoot);
    }

}