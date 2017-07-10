export WSK="${WSK-wsk}"

$WSK action update protected-action protected-action.js --kind nodejs:6 --web true

$WSK api create --config-file my-api-swagger.json