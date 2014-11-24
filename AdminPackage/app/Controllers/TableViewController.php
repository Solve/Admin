<?php
/*
 * This file is a part of Solve framework.
 *
 * @author Alexandr Viniychuk <alexandr.viniychuk@icloud.com>
 * @copyright 2009-2014, Alexandr Viniychuk
 * created: 14.11.14 20:07
 */

namespace Admin\Controllers;


use Solve\AdminPackage\AdminService;
use Solve\Controller\ApiController;
use Solve\Database\Models\Abilities\FilesAbility;
use Solve\Database\Models\Model;
use Solve\Database\Models\ModelCollection;
use Solve\Database\QC;
use Solve\Http\Response;
use Solve\Kernel\DC;
use Solve\Storage\SessionStorage;
use Solve\Utils\FSService;
use Solve\Utils\Inflector;

class TableViewController extends ApiController {

    protected $_moduleName;

    protected $_moduleConfig;

    protected $_unprotectedMethods = array('tmpFile');

    public function _preAction() {
        $this->_moduleName   = $this->request->getVar('moduleName');
        $this->_moduleConfig = AdminService::getStructure($this->_moduleName);
        FilesAbility::setBaseStoreLocation(DC::getEnvironment()->getWebRoot() . 'upload/');
    }

    public function getConfigAction() {
        $columns = array();
        foreach ($this->_moduleConfig['columns'] as $name => $info) {
            $info['name'] = $name;
            if (empty($info['type'])) $info['type'] = 'text';
            if (empty($info['display'])) $info['display'] = $info['type'];
            $columns[] = $info;
        }
        $this->_moduleConfig['columns'] = $columns;
        $this->setData($this->_moduleConfig);
    }

    public function listAction() {
        $modelName = $this->_moduleConfig['model'];
        $qc        = new QC();
        $this->processRequestFilters($qc);
        $objects = call_user_func(array($modelName, 'loadList'), $qc);
        $this->loadAbilitiesForCaller($objects);

        $this->setData($objects->getArray(), 'objects');
    }

    public function infoAction() {
        $modelName = $this->_moduleConfig['model'];
        $qc        = new QC();
        if ($id = $this->request->getVar('id')) {
            $qc->and(array('id' => $id));
        }
        /**
         * @var Model $object
         */
        $object = call_user_func(array($modelName, 'loadOne'), $qc);
        $this->loadAbilitiesForCaller($object);

        $this->setData($object->getArray(), 'object');
    }

    public function saveAction() {
        $modelName = $this->_moduleConfig['model'];
        if ($data = $this->request->getVar('data')) {
            /**
             * @var Model $object
             */
            $object = new $this->_moduleConfig['model'];
            $abilities = $object->_getStructure('abilities');

            if (!empty($data['id'])) {
                $object = call_user_func(array($modelName, 'loadOne'), QC::create()->and(array('id' => $data['id'])));
                unset($data['id']);
            }
            $object->mergeWithData($data);
            if ($object->save()) {
                if (!empty($abilities['files'])) {
                    $sessionStorage = new SessionStorage(array(), 'file_storage_' . $this->_moduleName);
                    foreach(array_keys($abilities['files']) as $fileAlias) {
                        if ($sessionStorage->has($fileAlias)) {
                            foreach($sessionStorage->get($fileAlias) as $filePath) {
                                $object->attachFileFromPath($fileAlias, $filePath);
                            }
                        }
                        $sessionStorage->offsetUnset($fileAlias);
                    }
                }
                $this->setData($object->getArray(), 'object');
            } else {
                $this->setError('Error while saving');
            }
        }
    }

    public function deleteAction() {
        $data = $this->requireData('ids');
        $qc = QC::create()->where(array('id' => $data['ids']));
        $objects = call_user_func(array($this->_moduleConfig['model'], 'loadList'), $qc);
        if ($objects) {
            $objects->delete();
            $this->setMessage('objects deleted');
        } else {
            $this->setError('error while deleting objects');
        }
    }

    public function uploadAction() {
        $tmpLocation = DC::getEnvironment()->getTmpRoot() . session_id() . '/' . $this->_moduleName . '/';
        FSService::makeWritable($tmpLocation);
        $sessionStorage = new SessionStorage(array(), 'file_storage_' . $this->_moduleName);
        $preview        = array();
        $files          = FilesAbility::reformatFilesArray($_FILES);
        foreach ($files as $index => $fileList) {
            $filesToSave = array();
            $fieldName   = false;
            foreach ($fileList as $name => $info) {
                $location = $tmpLocation . $name . '/';
                FSService::makeWritable($location);
                move_uploaded_file($info['tmp_name'], $location . $info['name']);
                $filesToSave[]  = $location . $info['name'];
                $preview[$name] = FSService::getFileInfo($location . $info['name']);
                $preview[$name]['link'] = 'admin/' . $this->_moduleName . '/tmp-file/?p=' . $preview[$name]['link'];
                $fieldName      = $name;
            }
            if ($fieldName) $sessionStorage->set($fieldName, $filesToSave);
        }
        $this->setData($preview, 'preview');
    }

    public function tmpFileAction() {
        if ($path = $this->request->getVar('p')) {
            if (!FSService::showFileAndExit(DC::getEnvironment()->getTmpRoot() . $path)) {
                $response = new Response('<h1>Requested content not found</h1>', 404);
                $response->send();
                die();
            }
        }
    }

    protected function processRequestFilters(QC $qc) {
        // paging
        $page  = $this->request->getVar('page', 1);
        $count = $this->request->getVar('count', 10);
        $qc->limit(($page - 1) * $count, $count);

        // sorting
        $sorting = $this->request->getVar('sorting', null);
        if (is_array($sorting)) {
            foreach ($sorting as $key => $type) {
                $qc->orderBy($key . ' ' . ($type == 'asc' ? 'ASC' : 'DESC'));
            }
        }


        $this->setData(array(
            'total' => QC::create('users')->select('count(*) cnt')->use('cnt')->executeOne(),
            'page'  => $page,
            'count' => $count,
        ), 'paging');

        $this->setData($sorting, 'sorting');
    }

    /**
     * @param Model|ModelCollection $caller
     */
    protected function loadAbilitiesForCaller($caller) {
        $files = $caller->_getStructure()->getAbilityInfo('files');
        if (!empty($files)) {
            foreach(array_keys($files) as $fileAlias) {
                $getterName = 'get'.Inflector::classify($fileAlias);
                if ($caller instanceof Model) $caller = array($caller);
                foreach($caller as $object) {
                    $object->$getterName();
                }
            }
        }

    }

}