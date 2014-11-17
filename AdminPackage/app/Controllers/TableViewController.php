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
use Solve\Database\Models\Model;
use Solve\Database\QC;

class TableViewController extends ApiController {

    protected $_moduleName;

    protected $_moduleConfig;

    public function _preAction() {
        $this->_moduleName   = $this->request->getVar('moduleName');
        $this->_moduleConfig = AdminService::getStructure($this->_moduleName);
    }

    public function getConfigAction() {
        $this->setData($this->_moduleConfig);
    }

    public function listAction() {
        $modelName = $this->_moduleConfig['model'];
        $qc        = new QC();
        $this->processRequestFilters($qc);
        $data = call_user_func(array($modelName, 'loadList'), $qc);

        $this->setData($data->getArray(), 'objects');
    }

    public function saveAction() {
        if ($data = $this->request->getVar('data')) {
            /**
             * @var Model $object
             */
            $object = new $this->_moduleConfig['model'];
            $object->mergeWithData($data);
            if ($object->save()) {
                $this->setData($object->getArray(), 'object');
            } else {
                $this->setError('Error while saving');
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
            foreach($sorting as $key=>$type) {
                $qc->orderBy($key . ' ' . ($type == 'asc' ? 'ASC' : 'DESC'));
            }
        }


        $this->setData(array(
            'total' => QC::create('users')->select('count(*) cnt')->use('cnt')->executeOne(),
            'page'  => $page,
            'count' => $count,
        ), 'paging');

        $this->setData($sorting , 'sorting');
    }

}