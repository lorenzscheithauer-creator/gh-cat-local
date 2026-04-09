<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=30, stale-while-revalidate=300');

try {
  $pdo = gh_pdo();
  $table = 'GewinneDB';
  $activeWhere = gh_active_where($pdo, $table);

  $sql = "
    SELECT
      veranstalter AS name,
      COUNT(*) AS count,
      COALESCE(SUM(gesamtwert), 0) AS total_value
    FROM {$table}
    WHERE {$activeWhere}
      AND veranstalter IS NOT NULL
      AND TRIM(veranstalter) <> ''
    GROUP BY veranstalter
    ORDER BY total_value DESC, count DESC, veranstalter ASC
  ";

  $stmt = $pdo->query($sql);
  $items = [];

  foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    $items[] = [
      'name' => (string)$row['name'],
      'count' => (int)$row['count'],
      'total_value' => (int)$row['total_value'],
    ];
  }

  echo json_encode([
    'items' => $items
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
  http_response_code(200);
  echo json_encode([
    'items' => []
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
