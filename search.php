<?php
declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=30, stale-while-revalidate=300');

function gh_money_expr(string $column = 'gesamtwert'): string {
  return "CAST(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(COALESCE($column, '0'), '.', ''),
          ',', '.'
        ),
        '€', ''
      ),
      ' ', ''
    ) AS DECIMAL(12,2)
  )";
}

try {
  $pdo = gh_pdo();
  $table = 'GewinneDB';
  $activeWhere = gh_active_where($pdo, $table);
  $moneyExpr = gh_money_expr('gesamtwert');

  $q = isset($_GET['q']) ? trim((string)$_GET['q']) : '';
  $page = isset($_GET['page']) ? max(1, (int)$_GET['page']) : 1;
  $perPage = 50;
  $offset = ($page - 1) * $perPage;

  $minValue = isset($_GET['min_value']) ? (float)$_GET['min_value'] : 0.0;
  $cat = isset($_GET['cat']) ? trim((string)$_GET['cat']) : '';
  $endingSoon = isset($_GET['ending_soon']) && (string)$_GET['ending_soon'] === '1';

  $whereParts = [];
  $params = [];

  $whereParts[] = "({$activeWhere})";

  if ($q !== '') {
    $terms = preg_split('/\s+/u', mb_strtolower($q), -1, PREG_SPLIT_NO_EMPTY);
    if ($terms) {
      $blob = "LOWER(CONCAT_WS(' ',
        COALESCE(clickbait, ''),
        COALESCE(veranstalter, ''),
        COALESCE(kategorie, ''),
        COALESCE(gewinne, ''),
        COALESCE(enddatum, ''),
        COALESCE(loesung, ''),
        COALESCE(zusammenfassung, '')
      ))";

      foreach ($terms as $i => $term) {
        $key = ':t' . $i;
        $whereParts[] = "{$blob} LIKE {$key}";
        $params[$key] = '%' . $term . '%';
      }
    }
  }

  if ($minValue > 0) {
    $whereParts[] = "{$moneyExpr} >= :min_value";
    $params[':min_value'] = $minValue;
  }

  if ($cat !== '' && $cat !== 'alle' && $cat !== 'all') {
    $whereParts[] = "LOWER(COALESCE(kategorie, '')) LIKE :cat";
    $params[':cat'] = '%' . mb_strtolower($cat) . '%';
  }

  if ($endingSoon) {
    $whereParts[] = "enddatum IS NOT NULL";
    $whereParts[] = "enddatum >= CURDATE()";
    $whereParts[] = "enddatum <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)";
  }

  $whereSql = implode(' AND ', $whereParts);

  $sqlCount = "SELECT COUNT(*) FROM {$table} WHERE {$whereSql}";
  $stCount = $pdo->prepare($sqlCount);
  foreach ($params as $k => $v) {
    if ($k === ':min_value') {
      $stCount->bindValue($k, $v);
    } else {
      $stCount->bindValue($k, $v, PDO::PARAM_STR);
    }
  }
  $stCount->execute();
  $total = (int)$stCount->fetchColumn();

  $sql = "
    SELECT *, {$moneyExpr} AS __money
    FROM {$table}
    WHERE {$whereSql}
    ORDER BY __money DESC, id DESC
    LIMIT :limit OFFSET :offset
  ";

  $st = $pdo->prepare($sql);
  foreach ($params as $k => $v) {
    if ($k === ':min_value') {
      $st->bindValue($k, $v);
    } else {
      $st->bindValue($k, $v, PDO::PARAM_STR);
    }
  }
  $st->bindValue(':limit', $perPage, PDO::PARAM_INT);
  $st->bindValue(':offset', $offset, PDO::PARAM_INT);
  $st->execute();

  $items = $st->fetchAll(PDO::FETCH_ASSOC) ?: [];

  foreach ($items as &$item) {
    if (isset($item['id'])) $item['id'] = (int)$item['id'];
    if (isset($item['anzahl_gewinne'])) $item['anzahl_gewinne'] = (int)$item['anzahl_gewinne'];
    unset($item['__money']);
  }

  echo json_encode([
    'items' => $items,
    'page' => $page,
    'per_page' => $perPage,
    'total' => $total,
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {
  echo json_encode([
    'items' => [],
    'page' => 1,
    'per_page' => 50,
    'total' => 0,
    'error' => $e->getMessage(),
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
