<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function index()
    {
        return Module::orderBy('module_name')->get(['id','module_name']);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'module_name' => 'required|string|min:1|max:255|unique:modules,module_name',
        ]);
        return Module::create($data);
    }
}