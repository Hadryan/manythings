
SQL_HOST=${PG_HOST:-"postgres"}
SQL_USER=${PG_USERNAME:-"postgres"}
SQL_DB=${PG_DATABASE:-"postgres"}

TABLE="${2}"
FILE_PATH="backup/$TABLE.sql"

echo ""
echo "======== PG RESTORE ========"
echo "host:      $PG_HOST"
echo "user:      $PG_USERNAME"
echo "database:  $PG_DATABASE"
echo "target:    $FILE_PATH"
echo ""
enterToContinue
echo ""
echo ""

humble exec postgres pg_restore --user=$SQL_USER --table=$TABLE -C -d $SQL_DB $FILE_PATH