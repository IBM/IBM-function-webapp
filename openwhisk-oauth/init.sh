export WSK="${WSK-wsk}"

PROVIDERS=`cat providers.json`

$WSK action update oauth-login oauth-login.js --kind nodejs:6 -p providers "${PROVIDERS}" -p provider "google"

$WSK action update oauth-redirect oauth-redirect.js --kind nodejs:6 -a web-export true -p providers "${PROVIDERS}" -p provider "google"

$WSK action update --sequence oauth-login-and-redirect oauth-login,oauth-redirect -a web-export true