<?php
function loadEnv($path) {
  if (!file_exists($path)) return;
  $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    if (str_starts_with(trim($line), '#')) continue;
    [$key, $value] = array_pad(explode('=', $line, 2), 2, null);
    if ($key && $value) {
      $value = preg_replace('/^["\'](.*)["\']$/', '$1', $value);
      putenv("$key=$value");
      $_ENV[$key] = $value;
      $_SERVER[$key] = $value;
    }
  }
}