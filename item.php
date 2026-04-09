<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=30, stale-while-revalidate=300');

try {
  $pdo = gh_pdo();
  $table = 'GewinneDB';
  $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

  if ($id <= 0) {
    echo json_encode([], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
  }

  $st = $pdo->prepare("SELECT * FROM {$table} WHERE id = :id LIMIT 1");
  $st->execute([':id' => $id]);
  $row = $st->fetch(PDO::FETCH_ASSOC);

  if (!$row) {
    echo json_encode([], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
  }

  if (isset($row['id'])) $row['id'] = (int)$row['id'];
  if (isset($row['anzahl_gewinne'])) $row['anzahl_gewinne'] = (int)$row['anzahl_gewinne'];

  echo json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
  echo json_encode([], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
