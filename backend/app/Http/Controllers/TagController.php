<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
        return Tag::orderBy('tag_name')->get(['id','tag_name']);
    }

    public function store(Request $r)
    {
        $data = $r->validate([
            'tag_name' => 'required|string|min:1|max:50|unique:tags,tag_name',
        ]);
        return Tag::create($data);
    }
}