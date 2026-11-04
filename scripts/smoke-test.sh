set -euo pipefail

URL="${1:-http://localhost:3000}"
EXPECTED_VERSION="${2:-}"

echo "→ Aguardando $URL/health ..."
body=""
for i in $(seq 1 30); do
  if body="$(curl -fsS "$URL/health" 2>/dev/null)"; then
    echo "  saudável após $i tentativa(s): $body"
    break
  fi
  body=""
  sleep 2
done

if [ -z "$body" ]; then
  echo "✖ A aplicação não respondeu em /health a tempo." >&2
  exit 1
fi

if [ -n "$EXPECTED_VERSION" ]; then
  if echo "$body" | grep -q "\"version\":\"$EXPECTED_VERSION\""; then
    echo "✔ Versão em execução confere: $EXPECTED_VERSION"
  else
    echo "✖ Versão esperada '$EXPECTED_VERSION', mas /health respondeu: $body" >&2
    exit 1
  fi
fi

echo "→ Testando a API (criar + listar tarefa)..."
curl -fsS -X POST "$URL/api/tasks" \
  -H 'Content-Type: application/json' \
  -d '{"title":"smoke test"}' >/dev/null
curl -fsS "$URL/api/tasks" | grep -q "smoke test"
echo "✔ Smoke test OK"
