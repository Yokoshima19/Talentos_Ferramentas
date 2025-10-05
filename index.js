<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Firebase Financial Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="index.css" />

  <script type="importmap">
  {
    "imports": {
      "react": "https://esm.sh/react@18.2.0",
      "react-dom/client": "https://esm.sh/react-dom@18.2.0/client",
      "recharts": "https://esm.sh/recharts@2.12.7",
      "papaparse": "https://esm.sh/papaparse@5.4.1",
      "firebase/app": "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js",
      "firebase/auth": "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js",
      "firebase/database": "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"
    }
  }
  </script>
</head>
<body class="min-h-screen bg-gray-900">
  <div id="root"></div>

  <!-- Carregue o JS gerado (não .tsx) -->
  <script type="module" src="./index.js"></script>
</body>
</html>
