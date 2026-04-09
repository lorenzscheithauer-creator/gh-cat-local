<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=30, stale-while-revalidate=300');

try {
  $pdo = gh_pdo();
  $table = 'GewinneDB';
  $cat = trim((string)($_GET['cat'] ?? ''));
  $cat = gh_normalize_cat_slug($cat);

  if ($cat === '' || $cat === 'all' || $cat === 'alle') {
    echo json_encode([
      'featured' => null,
      'active' => ['items' => []],
      'inactive' => ['items' => []],
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
  }

  $variants = gh_cat_variants($cat);
  $params = [];
  $placeholders = [];
  $likeConditions = [];

  foreach ($variants as $i => $v) {
    $key = ':cat' . $i;
    $lk = ':catlike' . $i;
    $placeholders[] = $key;
    $likeConditions[] = "LOWER(kategorie) LIKE {$lk}";
    $params[$key] = $v;
    $params[$lk] = '%' . $v . '%';
  }

  $hasAktiv = gh_has_column($pdo, $table, 'aktiv');
  $hasEnd = gh_has_column($pdo, $table, 'enddatum');

  if ($hasAktiv) {
    $activeExpr = "CASE WHEN aktiv = 'ja' THEN 1 ELSE 0 END";
  } elseif ($hasEnd) {
    $activeExpr = "CASE WHEN enddatum IS NOT NULL AND enddatum >= CURDATE() THEN 1 ELSE 0 END";
  } else {
    $activeExpr = "1";
  }

  $sql = "
    SELECT *, {$activeExpr} AS __active
    FROM {$table}
    WHERE (
      LOWER(kategorie) IN (" . implode(',', $placeholders) . ")
      OR " . implode(' OR ', $likeConditions) . "
    )
    ORDER BY __active DESC, gesamtwert DESC, id DESC
  ";

  $st = $pdo->prepare($sql);
  foreach ($params as $k => $v) {
    $st->bindValue($k, $v, PDO::PARAM_STR);
  }
  $st->execute();
  $rows = $st->fetchAll(PDO::FETCH_ASSOC) ?: [];

  $normalize = static function(array $r): array {
    $active = ((int)($r['__active'] ?? 0)) === 1;
    unset($r['__active']);
    if (isset($r['id'])) $r['id'] = (int)$r['id'];
    if (isset($r['gesamtwert'])) $r['gesamtwert'] = (int)$r['gesamtwert'];
    if (isset($r['anzahl_gewinne'])) $r['anzahl_gewinne'] = (int)$r['anzahl_gewinne'];
    $r['active'] = $active;
    return $r;
  };

  $rows = array_map($normalize, $rows);

  $active = array_values(array_filter($rows, fn($r) => !empty($r['active'])));
  $inactive = array_values(array_filter($rows, fn($r) => empty($r['active'])));
  $featured = $active[0] ?? ($rows[0] ?? null);

  echo json_encode([
    'featured' => $featured,
    'active' => ['items' => $active],
    'inactive' => ['items' => $inactive],
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
  echo json_encode([
    'featured' => null,
    'active' => ['items' => []],
    'inactive' => ['items' => []],
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
