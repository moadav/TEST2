@extends('layouts.app')
@section('title', $post->title . ' — Acme Blog')
@section('content')
  <article>{{ $post->body }}</article>
@endsection
